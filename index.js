
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var creds = require('./creds.js');


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

      function checkType (str) {
        if (str == "auto" || str == "bug" || str == "change" ||
          str == "deploy" || str == "epic" || str == "improvement" ||
          str == "spike" || str == "story" || //str == "doc" ||
          str == "sub-task" || str == "task" || //str == "technical" ||
          str == "test" || str == "toggle")
          return str;

        else if (str == "new")
          return '"' + "new%20feature" + '"';

        else if (str == "security")
          return '"' + "security%20review" + '"';

        else if (str == "subtask")
          return "sub-task";

        //else if (str == "technical")
        //   return '"' + "technical%20task" + '"';

        else
          return ""
        }

        function checkStatus (str) {
        if (str == "answered" || str == "backlog" || str == "blocked" ||
          str == "canceled" || str == "closed" || str == "done" ||
          str == "failed" || str == "hotpatch" || str == "locked" ||
          str == "master" || str == "open" || str == "passed" ||
          str == "rc" || str == "reopened" || str == "resolved" ||
          str == "sec" || /*str == "technical" ||*/ str == "verified")
          return str;

        else if (str == "cab")
          return '"' + "cab%20review" + '"';

        else if (str == "customer")
          return '"' + "customer%20support%20review" + '"';

        else if (str == "draft")
          return '"' + "draft%20in%20progress" + '"';

        else if (str == "external")
          return '"' + "external%20draft" + '"';

        //else if (str == "revoke")
        //  return '"' + "hotpatch%20-%20revoke%20access" + '"';

        else if (str == "development")
          return '"' + "in%20development" + '"';

        else if (str == "progress")
          return '"' + "in%20progress" + '"';

        else if (str == "qa")
          return '"' + "in%20qa%20review" + '"';

        else if (str == "review")
          return '"' + "in%20review" + '"';

        else if (str == "management")
          return '"' + "management%20review" + '"';

        else if (str == "mgmt")
          return '"' + "mgmt%20review" + '"';

        else if (str == "hold")
          return '"' + "on%20hold" + '"';

        else if (str == "pending")
          return '"' + "on%20hold%2C%20pending%20more%20info" + '"';

        else if (str == "publish")
          return '"' + "publish%20to%20gold" + '"';

        else if (str == "ready")
          return '"' + "ready%20for%20change" + '"';

        else if (str == "returned")
          return '"' + "returned%20for%20clarification" + '"';

        else if (str == "selected")
          return '"' + "selected%20for%20development" + '"';

        //else if (str == "technical")
        //  return '"' + "technical%20review" + '"';

        else if (str == "to")
          return '"' + "to%20do" + '"';

        //else if (str == "toggle")
        //  return '"' + "toggle%20verified" + '"';

        else if (str == "waiting")
          return '"' + "waiting%20for%20qa" + '"';

        else
          return ""
        }

        res.status('200').send('Retrieving Jiras . . . :robot_face:');

        var response_url = req.body.response_url;
        console.log(response_url);

        var arr = req.body.text.toLowerCase().split(" ");


        var username = "";
        var type = "";
        var status = "";
        var visibility = false;

        var hasStatus = false
        var hasType = false

        /* Status & Types */

        for (var i = 0; i < arr.length; i++)
         {
          if (arr[i].includes('-v'))
            visibility = true;

          if (arr[i].includes('.'))
            username = arr[i]

          if (checkType(arr[i]) != "" && !hasType){
            type = checkType(arr[i])

            if (type == "sub-task" && (arr[i + 1] == "auto" || arr[i + 1] == "bug" || arr[i + 1] == "change" ||
                arr[i + 1] == "doc" || arr[i + 1] == "test")) {
                type = '"' + "sub-task" + "%20" + arr[i + 1] + '"';
              i++;
            }

            //else if (type == "technical") {
              //console.log(arr[i+1])
            //  if (arr[i + 1] == "task") {
            //    type = '"' + "technical%20task" + '"';
            //    i++;
            //  }
             // else
               // type = "";
            //}
          }

          if (checkStatus(arr[i]) != "" && !hasStatus)
          {
            status = checkStatus(arr[i])
            if (status == '"' + "in%20qa%20review" + '"' || status == '"' + "management%20review" + '"' ||
            status == '"' + "mgmt%20review" + '"' )
              i++;

            else if (status == "hotpatch" && arr[i + 2] == 'revoke') {
              status = '"' + "hotpatch" + "%20-%20revoke%20access" + '"';
              i++;
            }

            else if (status == "rc" && arr[i + 2] == 'revoke') {
              status = '"' + "rc" + "%20-%20revoke%20access" + '"';
              i += 1;
            }

            else if (status == '"' + "ready%20for%20change" + '"') {
              i += 2;
            }

            else if (status == "sec") {
              if (arr[i + 1] == "approved")
                status = '"' + "sec" + "%20approved" + '"';
              else if (arr[i + 1] == "review")
                status = '"' + "sec" + "%20review" + '"';
              else
                status = ""
              i++;
            }

            //else if (status == "technical") {
            //  if (arr[i + 1] == "review") {
            //    status = '"' + "technical%20review" + '"';
            //    i++;
            //  }
              //else
              //  status = "";
            //}

            else if (status == '"' + "to%20do" + '"') {
              i += 2;
            }

            //else if (status == "toggle")

            else if (status == '"' + "waiting%20for%20qa" + '"') {
              i += 2;
            }
          }

          if (arr[i - 1] == "toggle" && arr[i] + " " + arr[i+1] == "toggle verified")
          {
            hasStatus = true;
            status = '"' + "toggle%20verified" + '"';
            i+=1;
          }

          if (arr[i] + " " + arr[i+1] == "technical task")
          {
            hasType = true;
            type = '"' + "technical%20task" + '"';
            i+=1;
          }

          if (arr[i] + " " + arr[i+1] == "technical review")
          {
            hasStatus = true;
            status = '"' + "technical%20review" + '"';
            i+=1;
          }
        }

        if (username == "")
          username = req.body.user_name;

        if (username.startsWith("@"))
          username = username.substring(1);

        var userString = "assignee" + "%20%3D%20" + username;
        var statusString = "";
        var typeString = "";

        if(status != "")
          statusString = "%20AND%20status" + "%20%3D%20" + status;
        else
          statusString = "%20AND%20status" + "%20%3D%20" + '"' + "in%20progress" + '"';

        if (type != "")
          typeString = "%20AND%20type" + "%20%3D%20" + type;


        var dhruv = creds.user,
          password = creds.pw,
          url = 'https://' + dhruv + ':' + password + '@jira2-test.workday.com:443/rest/api/2/search?jql=' + userString + statusString + typeString;


          request({url: url}, function (error, response, body) {
            var res_json = JSON.parse(response.body);

            /* Creating response obj to Slack*/
            var attachments = [];
            var text = "";
            for(var i = 0; i < res_json.issues.length; i++) {

              var fix_versions_name = "";
              if (res_json.issues[i].fields.fixVersions.length != 0)
                fix_versions_name = " (" + res_json.issues[i].fields.fixVersions[0].name + ")";

              var components = "";
              if (res_json.issues[i].fields.components.length != 0)
                components = res_json.issues[i].fields.components[0].name;

              var label = res_json.issues[i].fields.labels;
              if (label.length == 0)
                label = " | ";
              else {
                label = " | " + label.toString() + " | ";
              }

              var obj_to_slack = {};
              obj_to_slack['title'] = "[" + res_json.issues[i].fields.issuetype.name + "] " + res_json.issues[i].key + " - " + res_json.issues[i].fields.summary;
              obj_to_slack['title_link'] = "https://jira2-test.workday.com/browse/" + res_json.issues[i].key;
              obj_to_slack['color'] = '#3AA3E3';
              obj_to_slack['text'] = components + label+ fix_versions_name;
              obj_to_slack['attachment_type'] = 'default';
              obj_to_slack['mrkdwn_in'] = ['text', 'fields'];
              attachments.push(obj_to_slack);

              //text += res_json.issues[i].key + " - " + res_json.issues[i].fields.summary + "\n\n";
            }
            var vstr ="";
            if(visibility)
              vstr= "in_channel";

            var obj_to_slack = {

              "response_type": vstr,
              "text": "Jiras for " + username,
              "attachments": attachments
            };

            //console.log(obj_to_slack);


            /* Send message obj to slack */
            request({
                url: response_url,
                method: 'POST',
                json: obj_to_slack
            }, function(error, response, body){
                if(error) {
                    console.log(error);
                } else {
                    console.log(response.statusCode, body);
            }
            });


          });

    });
});
