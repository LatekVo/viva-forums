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

// wow looks so much cleaner without semicolons
let dbpath = "./db_database"
let dbCache = undefined
let initDb = async () => {
    dbCache = JSON.parse(
        await fs.promises.readFile(
            dbpath,
            { encoding : 'utf8'}
        )
    );
}
initDb();
// databases for posts
// user, id, timestamp, image-src, data
let postpath = "./db_postbase"
let postCache = undefined
let initPostDb = async () => {
    postCache = JSON.parse(
        await fs.promises.readFile(
            postpath,
            { encoding : 'utf8'}
        )
    );
}
initPostDb();

// handle caching
// handle (is already verified to be valid if it can be found here), username
let userCache = [];

async function addRecord(newRecord) {

    var repeats = dbCache.filter(function(query) {
        return query.email === newRecord.email || query.username === newRecord.username;
    });

    if (repeats.length != 0) {
        return false;
    }

    dbCache.push(newRecord);

    // Writing all records back to the file
    await fs.promises.writeFile(
        dbpath,
        JSON.stringify(dbCache, null, 2)
    )

    return true;

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

    var responseUrl = 'assets/successful.html/&';

    var user = dbCache.filter(function(query) {
        return query.username === newRecord.username;
    });

    if (user.length == 0) {
        responseUrl += "error=username_incorrect"
        res.writeHead('401');
    } else
    if (user.password != password) {
        responseUrl += "error=password_incorrect"
        res.writeHead('401');
    } else {
        // temporary handle for the login duration
        var userHash = Math.random().toString(36).substring(2);

        userCache += {userHash, username};
        responseUrl += "hash=" + userHash;
        res.writeHead('200');
    }

    res.write(fs.readFileSync(responseUrl, 'utf8'));
    res.send();

    console.log(req.body);
});
app.post('/register', async (req, res) => {
    var {username, email, password, passwordRepeat} = req.body;

    await addRecord({username, email, password});
});
app.post('post', async (req, res) => {
    // handle and date will be located in a hidden input field
    var {handle, date, imgUrl, text} = req.body;
    console.log(req.body);

    await addPost({username, email, password});
});

var server = app.listen(3000);
console.log("server started");