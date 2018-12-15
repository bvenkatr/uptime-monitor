/*
 * Primary file for API
 *
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const StringDecoder = require('string_decoder').StringDecoder;
const config = require("./config");

// const querystring = require('querystring');
// if (oRequest.url.indexOf('?') >= 0) {
//     oQueryParams = queryString.parse(oRequest.url.replace(/^.*\?/, ''));
//
//     // do stuff
//     console.log(oQueryParams);
// }

//Create an HTTP tunneling proxy
const httpServerPropxy = http.createServer((req, res) => {
    unifiedHandler(req, res);
});

httpServerPropxy.listen(config.httpPort, () => {
    var addr = httpServerPropxy.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});

//Generate https tokens and pass as first argument(generally called as options) to createServer function.
const httpsServerPropxy = https.createServer({
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem")
}, (req, res) => {
    unifiedHandler(req, res);
});

httpsServerPropxy.listen(config.httpsPort, () => {
    var addr = httpsServerPropxy.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});

const unifiedHandler = (req, res) => {

    // parse the url
    let parsedUrl = url.parse(req.url,  true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the query string as an object
    queryStringObject = parsedUrl.query;

    // Get the HTTP method
    let method = req.method.toLocaleLowerCase();

    // Get the HTTP headers as an object
    let headers = req.headers;

    let decoder = new StringDecoder("utf-8");
    let buffer = "";
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFoundHandler;

        let data = {
            path: trimmedPath,
            method: method,
            headers: headers,
            payload: buffer
        };
        chosenHandler(data, (statusCode, payload) => {
            // res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(payload));
        });
    });
};

const handlers = {};

handlers.notFoundHandler = (data, callback) => {
    callback(404, "Not Found");
};

handlers.hello = (data, callack) => {
    callack(200, "Hello World");
};

const router = {
    hello: handlers.hello,
};
