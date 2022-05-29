// Node.js

var http = require('http');
var events = require("events");
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

    if (request.method != 'POST') {
        console.log("bad request type: ", request.method)
    } else {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            try {
                var post = JSON.parse(body);
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
    }
});
/* gonna try something different
// close neccesary things before exiting
var Handler = function() {
    process.on('exit', () => {
        MongoClient.close();
        console.log("exiting");
    });
}

console.log("trying to start mongodb...");
const client = new MongoClient(mongourl);
async function initDb() {
    let response = await client.connect()
        .catch((err) => {
            console.error(err);
        });

    if (client.connected()) {
        console.log("successfully started mongodb");
    } else {
        console.log("failed to start mongodb, exiting!");
        process.exit(1);
    }
}
initDb();
*/
server.listen(3000);
console.log("server started");