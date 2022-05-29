// Node.js

var http = require('http');
var events = require("events");
var fs = require('fs');
var bodyParser = require('body-parser')

// local database
var db = require('./database')

// we'll try express atop of what's already here, it may be useful
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/assets/'));
app.use(bodyParser.urlencoded({extended : true}));

// seems like express can also process xmlhttp.. requests pretty well, hence the (req, res)
app.get('/', function(req, res) {
    res.writeHead('200');
    res.write(fs.readFileSync('assets/index.html', 'utf8'));
    res.send();
});

app.post('/login', function(req, res) {
    var {username, password} = req.body;
    console.log(uname);
});

//server.listen(3000);
var expressServer = app.listen(3000);
console.log("server started");