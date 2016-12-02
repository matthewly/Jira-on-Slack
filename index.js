
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var clientId = '110549175985.110544469152';
var clientSecret = 'a5b98c4f3734690601df13231d913d36';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const PORT=4350;


app.listen(PORT, function () {
    console.log("Jira4Ever app listening on port " + PORT);
});

app.get('/', function(req, res) {
    res.send('Jira4Ever is working! Path Hit: ' + req.url);
});

app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET',

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }

    app.post('/command', function(req, res) {
        console.log(req.body.text);
        res.send("mike g the g!!!");
    });
});
