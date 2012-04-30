#!/usr/bin/env node

// This is by far the worst Node app I've ever worked on.  I'm... sort of proud.  Or drunk.

var util = require("util");

var optimist = require("optimist");

var argv = optimist.argv;

var restify = require('restify');
var http = require('http');
var server = restify.createServer();

var TwilioClient = require('twilio').Client;
var Twiml = require('twilio').Twiml;
var client = new TwilioClient(argv["twilio-sid"], argv["twilio-token"], "bandontherun.orospakr.ca");

var orophone = client.getPhoneNumber('+16138007307');


var express = require('express');
var Bird = require('bird')({
  oauth_token : argv["twitter-token"],
  oauth_token_secret : argv["twitter-token-secret"],
  callback: 'http://bandontherun.orospakr.ca:8081/callback'
});

var app = express.createServer();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: "just-the-letter-a"}));

app.get('/', function(req, res){
  if (req.session.signedIn) {
    // res.send("Hi " + req.session.screen_name + " it's nice to see you signed in");
      res.writeHead(302, {Location: "/index.html?logged_in=true"});
      res.end()
  } else {
      res.writeHead(302, {Location: "/index.html"});
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
        console.log("HELLO> HQfdfslfsd asvfghilsadfl; .");
    Bird.auth_callback(req, function(err, access_token, access_token_secret, data){

      if (err) {
        //handle the error here if twitter returns an error
          console.log("WITWWRWRAER FUCKUPZ" + err);
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

var joinUserToConference = function(phoneNumber, done) {
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
};

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

app.get(/^\//, function(req, res) {
    // direct all other requests along to restify
    server.server.emit('request', req, res);
});



app.listen(8081);

var static = require('node-static');

var frontend_server = new(static.Server)('www');

// Adding /games route to the web service
server.get('/jams', function(req, res) {
    var client = reuqire('mysql').createClient({'host':'localhost','port':3306,'user':'band','password':'deadlock'});
    client.query('USE band');
    getJams(client, res);
});

// TODO: we're relying on the static server module to not serve
// anything outside of the www directory, which is a bit of leap of
// faith from a security standpoint.
server.get(/^\//, function(req, res) {
    console.log("Serving static file: " + req.path);
    frontend_server.serve(req, res, function(err, result) {
        if(err) {
            console.log("Problem serving static file: " + util.inspect(err));
            res.writeHead(err.status);
            res.end("NOPE");
        }
    });
});

server.listen(8080);

getJams = function(client, res) {
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
};

processList = function (i, results, jams, jams_players, client, response) {
    console.log("Boo");
    var element = results[i];
    var id = element['id'];
    
    i++;
    
    var http = require('http');
    var options = {
	host: 'developer.echonest.com',   
	port: 80,   
	path: '/api/v4/artist/images?api_key=N6E4NIOVYMTHNDM8J&name=Eric+Clapton&format=json&results=1&start=0&license=cc-by-sa'
    };
    
    var req = http.get(options, function(res) {
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
		
		response.send({
		    code: 200,
		    body: {
			jams: jams
		    }
		});
		
		client.end();
	    }
	 });
    }).on('error', function(e) {  
	 console.log("Got error: " + e.message);   
    });
}

containsJam = function (a, id) {
    for (var i = 0; i < a.length; i++) {
       if (a[i].id === id) {
           return true;
       }
    }
    return false;
};
