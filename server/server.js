import http from "http";

function parse(response, data) {
    // all of the json data gets valiated and processed here.
    // compose a rosponse here as well
}

let server = http.createServer(function(request, response) {
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

server.listen(3000);
console.log("server started");