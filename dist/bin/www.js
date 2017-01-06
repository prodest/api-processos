#!/usr/bin/env node
"use strict";
var app_1 = require("../app");
var debugMudule = require("debug");
var http = require("http");
var app_2 = require("../config/app");
var debug = debugMudule('admin-app:server');
/**
 * Normalize a port into a number, string, or false.
 */
var normalizePort = function (val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
};
/**
 * Event listener for HTTP server "error" event.
 */
var onError = function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
/**
 * Event listener for HTTP server "listening" event.
 */
var onListening = function () {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log("\nListening on " + bind + "...");
};
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(app_2["default"].port);
app_1["default"].set('port', port);
/**
 * Create HTTP server.
 */
var server = http.createServer(app_1["default"]);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//# sourceMappingURL=www.js.map
