#!/usr/bin/env node

var util = require('util');
var TwilioClient = require('twilio').Client;
var Twiml = require('twilio').Twiml;
var client = new TwilioClient(, AUTH_TOKEN, "bandontherun.orospakr.ca");

var orophone = client.getPhoneNumber('+15551213');

orophone.setup(function() {
    orophone.makeCall("+16135551212", null, function(call) {
        call.on('answered', function(reqParams, res) {
            console.log("poor bastard picked up: " + util.inspect(res));

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
