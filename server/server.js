// Node.js

var http = require('http');
var events = require("events");
var fs = require('fs');

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

// we'll try express atop of what's already here, it may be useful
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/assets/'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());

var dbpath = "./database";

async function addRecord(newRecord) {

    var dbData = await fs.promises.readFile(dbpath,{ encoding : 'utf8'});

    var dataObject = JSON.parse(dbData);

    dataObject.push(newRecord);

    // Writing all records back to the file
    await fs.promises.writeFile(
        dbpath,
        JSON.stringify(dataObject, null, 2)
    )

}

app.get('/', function (req, res) {
    res.writeHead('200');
    res.write(fs.readFileSync('assets/index.html', 'utf8'));
    res.send();
});

app.get('/register', function (req, res) {
    res.writeHead('200');
    res.write(fs.readFileSync('assets/register.html', 'utf8'));
    res.send();
});

app.post('/login', function(req, res) {
    var {username, password, remember} = req.body;
    console.log(req.body);
});
app.post('/register', async function (req, res) {
    var {username, email, password, passwordRepeat} = req.body;
    console.log(req.body);

    await addRecord({username, email, password});
});

var server = app.listen(3000);
console.log("server started");