var express = require('express');
var optimist = require("optimist");
var mysql = require('mysql')
var http = require('http');

var argv = optimist.argv;

//var TwilioClient = require('twilio').Client;
//var Twiml = require('twilio').Twiml;
//var client = new TwilioClient(argv["twilio-sid"], argv["twilio-token"], "stark-winter-4794.herokuapp.com");

//var orophone = client.getPhoneNumber('+16138007307');

//var Bird = require('bird')({
//    oauth_token : "zWUPMkhZwYRcuQZOuJg", //argv["twitter-token"],
//    oauth_token_secret : "FkACuojoR6fB8hrVFZBkxOUmqSEaLVnOeh9VNvolKk", //argv["twitter-token-secret"],
//    callback: 'http://stark-winter-4794.herokuapp.com/callback'
//});

var app = express.createServer();

app.enable("jsonp callback");

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
    secret: "just-the-letter-a"
}));

app.get('/', function(req, res){
    if (req.session.signedIn) {
        // res.send("Hi " + req.session.screen_name + " it's nice to see you signed in");
        res.writeHead(302, {
            Location: "/index.html?logged_in=true"
        });
        res.end()
    } else {
        res.writeHead(302, {
            Location: "/index.html"
        });
        res.end();
    }
});

app.get('/login', function(req, res){
    Bird.login(req, function(err, oauth_token, oauth_token_secret, results){
        if (err) {
            //handle the error here if twitter returns an error
            res.send(err);
        } else {
            //set 
            req.session.oauth_token = oauth_token;
            req.session.oauth_token_secret = oauth_token_secret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauth_token);
        }
    });
});

app.get('/callback', function(req, res){
    console.log("into /callback");
    Bird.auth_callback(req, function(err, access_token, access_token_secret, data){

        if (err) {
            //handle the error here if twitter returns an error
            console.log("error on /callback:" + err);
            res.send(err);
        } else {
            req.session.screen_name = data.screen_name;
            req.session.access_token = access_token;
            req.session.access_token_secret = access_token_secret;
            req.session.signedIn = 1;

            res.redirect('/');
        }
    });
});

app.get("/start_call", function(req, res) {
    console.log("ZOMG DIALING");
    joinUserToConference("+16132868829");
    joinUserToConference("+16136000342");
    // who cares about correct reporting, lawl
    res.writeHead(200);
    res.end();
});

app.get('/home_timeline', function(req, res){
    var options = req.query || {};
    options.include_entities = true;
    Bird.home_timeline(req, options, function(err, data, response){
        if (err) {
            //handle the error here if twitter returns an error
            res.send(err);
        } else {
            res.send(data);  
        }
    });
});

app.get('/jams',function(req, res){
    var client = mysql.createClient({
        'host':'us-cdbr-east.cleardb.com',
        'port':3306,
        'user':'978c4d073de058',
        'password':'45651d09'
    });
    client.query('USE heroku_217324e258ab7fa');
    getJams(client, res);
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("Listening on " + port);
});

function provides(type) {
    return function(req, res, next){
        if (req.accepts(type)) return next();
        next('route');
    }
}

function joinUserToConference(phoneNumber, done) {
    orophone.setup(function() {
        orophone.makeCall(phoneNumber, null, function(call) {
            call.on('answered', function(reqParams, res) {
                console.log("poor bastard picked up.");

                res.append(new Twiml.Say("Welcome to Band on the Run.  Please wait while your tubes connect."));
                var dial = new Twiml.Dial();
                dial.append(new Twiml.Conference("Band on the Run."));
                res.append(dial);
                
                res.send();
            });

            call.on('ended', function(reqParams) {
                console.log("He hung up.");
            });
        });
    });
}

function getJams(client, res) {
    client.query(
        'select j.id as id, j.title as title, j.artist as artist, ut.display_name as player from jams as j left join jams_needs as jn on j.id = jn.jam left join user_types as ut on jn.type = ut.id',
        function selectCb(error, results, fields) {
            if (error) {
                console.log('GetData Error: ' + error.message);
                client.end();
                return;
            }
            
            var element;
            var jams_players = {};
            var jams = [];

            for( var i = 0; i < results.length; i++ ) {
                element = results[i];
                var id = element['id'];

                if(!jams_players[id]) {
                    jams_players[id] = element['player'];
                } else {
                    jams_players[id] += (", " + element['player']);
                }
            }
            processList(0, results, jams, jams_players, client, res);
        });
}

function processList(i, results, jams, jams_players, client, response) {
    console.log("Boo");
    var element = results[i];
    var id = element['id'];
    
    i++;
    
    var options = {
        host: 'developer.echonest.com',   
        port: 80,   
        path: '/api/v4/artist/images?api_key=N6E4NIOVYMTHNDM8J&name=Eric+Clapton&format=json&results=1&start=0&license=cc-by-sa'
    };
    
    http.get(options, function(res) {
        console.log("Got response: " + res.statusCode);
        res.on('data', function(chunk) {
            var o = JSON.parse(chunk.toString("utf8"));
            console.log(chunk.toString("utf8"));
            console.log(i);
            console.log(o.response.images[0].url);

            if(!containsJam(jams, id)) {
                console.log("a");
                jams.push({
                    id: id,
                    title: element['title'],
                    artist: element['artist'],
                    needed: jams_players[id],
                    img: o.response.images[0].url
                });
                console.log(jams.length);
            }
            if (i < results.length) {
                processList(i, results, jams, jams_players, client, response)
            } else {

                response.json({
                        jams: jams
                });

                client.end();
            }
        });
    }).on('error', function(e) {  
        console.log("Got error: " + e.message);   
    });
}

function containsJam(a, id) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].id === id) {
            return true;
        }
    }
    return false;
}