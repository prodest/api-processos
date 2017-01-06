"use strict";
var app_1 = require("./config/app");
var bodyParser = require("body-parser");
if (app_1["default"].env === 'production') {
    require('newrelic');
}
var express = require("express");
var middlewareModule = require("node-mw-api-prodest");
var apiMiddleware = middlewareModule.middleware;
var app = express();
app.use(bodyParser.json());
app.use(apiMiddleware({
    compress: true,
    cors: true
}));
app.use(apiMiddleware({
    authentication: {
        jwtPublicKey: app_1["default"].jwtPublicKey
    }
}));
// load our routes
var process_1 = require("./routes/process");
process_1["default"](app);
app.use(apiMiddleware({
    error: {
        notFound: true,
        debug: app_1["default"].env === 'development'
    }
}));
var pathApp = express();
var path = app_1["default"].path;
pathApp.use(path, app);
exports.__esModule = true;
exports["default"] = pathApp;

//# sourceMappingURL=app.js.map
