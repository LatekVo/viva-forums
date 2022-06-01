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
async function initDb() {
    dbCache = JSON.parse(
        await fs.promises.readFile(
            dbpath,
            { encoding : 'utf8'}
        )
    );
}
// databases for posts
// user, id, timestamp, image-src, data
let postpath = "./db_postbase"
let postCache = undefined
async function initPostDb () {
    postCache = JSON.parse(
        await fs.promises.readFile(
            postpath,
            { encoding : 'utf8'}
        )
    );
}
initDb();
initPostDb();

// handle caching
// handle (is already verified to be valid if it can be found here), username
const userCache = [{hash: "secretAnonHash", username: "Anonymous"}];

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

async function addPost(newPost) {

    var handledUser = userCache.filter(function(query) {
        return query.userHash === newPost.userHash;
    });

    postCache.push(newPost);

    // Writing all records back to the file
    await fs.promises.writeFile(
        postpath,
        JSON.stringify(postCache, null, 2)
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

    var responseHtml = '';

    var user = dbCache.filter(function(query) {
        return query.username === username;
    });

    var errors = 'none';
    if (user.length == 0) {
        res.cookie('error', 'invalid_username');
    }

    if (user[0]["password"] == password) {
        console.log("user found, hash sent");

        // temporary handle for the login duration
        var handledUser = {hash: "null", username: "null"};
        handledUser.hash = Math.random().toString(36).substring(2);
        handledUser.username = username;

        userCache.push(handledUser);

        res.cookie('secureUserHash', handledUser.hash);

    } else {
        res.cookie('error', 'invalid_password');
    }

    //res.cookie('loginerror', errors);
    res.write(fs.readFileSync('assets/index.html', 'utf8'));
    res.send();
});
app.post('/register', async (req, res) => {
    var {username, email, password, passwordRepeat} = req.body;

    console.log("new account added");

    await addRecord({username, email, password});

    res.write(fs.readFileSync('assets/index.html', 'utf8'));
    res.send();
});
app.post('/addPost', async (req, res) => {
    // handle and date will be located in a hidden input field
    var {handle, imgUrl, topic, content} = req.body;
    console.log(req.body);

    var status = await addPost({handle, imgUrl, topic, content});

    if (status == false) {
        res.writeHead('401')
    } else {
        res.writeHead('200');
    }

    res.write(fs.readFileSync('assets/index.html', 'utf8'));
    res.send();
});
// 64 posts per page
// pages are just the most recent posts
app.get('/getPost/:page', (req, res) => {

    res.writeHead('200');

    var multi = req.params.page * 64;

    if (postCache.length < 64) {
        res.write(JSON.stringify(postCache));
    } else {
        if (postCache.length < multi + 63)
            multi = postCache.length - 63;

        res.write(dbCache.slice(multi, multi + 63));
    }

    res.send();
});
var server = app.listen(3000);
console.log("server started");