// Node.js

var http = require('http');
var events = require("events");
var fs = require('fs');

// we'll try express atop of what's already here, it may be useful
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/assets/'));

var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var mongourl = "mongodb://localhost:27017/mydb";

function parse(response, data) {
    // all of the json data gets valiated and processed here.
    // compose a rosponse here as well
    console.log("received: ", data);
    console.log("response: ", response);
}

let server = http.createServer(function(request, response) {
    console.log("received a request");

    switch(request.method) {
        case 'POST':
            var body = '';
            request.on('data', function (data) {
                body += data;
            });
            request.on('end', function () {
                try {
                    let post = JSON.parse(body);
                    parse(request, post);
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.end();
                    return;
                } catch (err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write("Bad Post Data. Error: ", err);
                    response.end();
                    return;
                }
            });
            break;
        case 'GET':
            var body = '';
            response.statusCode = 200;
            response.write();
            break;
        default:
            console.log("bad request type: ", request.method)
    }
    console.log("response sent")
});

// seems like express can also process xmlhttp.. requests pretty well, hence the (req, res)
app.get('/', function(req, res) {
    res.writeHead('200');
    res.write(fs.readFileSync('assets/index.html', 'utf8'));
    res.send();
});

//server.listen(3000);
var expressServer = app.listen(3000);
console.log("server started");