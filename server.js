var express = require('express');
var mongojs = require("mongojs");

var app = express.createServer();

app.enable("jsonp callback");

function provides(type) {
  return function(req, res, next){
    if (req.accepts(type)) return next();
    next('route');
  }
}

app.get('/jams',function(req, res){
  var db = mongojs.connect(process.env.DB_CONNECTION, ["jams"]);
  
  db.jams.find({}, function(err, jams) {
    if( err || !jams) {
      console.log("No female users found");
      }
    else {
      console.log(jams.length);
      processList(0, jams, res);
    }
  });
});

processList = function (i, jams, response) {
    var element = jams[i];
    
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
	    console.log(o.response.images[0].url);

	    element.img = o.response.images[0].url
	    
	    if (i < jams.length) {
		processList(i, jams, response)
	    } else {
                response.json({"jams": jams });
	    }
	 });
    }).on('error', function(e) {  
	 console.log("Got error: " + e.message);   
    });
}

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
