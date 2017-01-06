"use strict";
var app_1 = require("../config/app");
var processController_1 = require("../controllers/processController");
var verifyBasicAuthentication = function (token) {
    return function (req, res, next) {
        var authorizationHeader = req.get('Authorization');
        if (!authorizationHeader || authorizationHeader !== token) {
            res.statusCode = 401;
            res.send('Access denied');
        }
        else {
            next();
        }
    };
};
exports.__esModule = true;
exports["default"] = function (app) {
    var processController = new processController_1.ProcessController();
    app.get('/:number?', processController.getSingle);
    app.post('/process/update', verifyBasicAuthentication(app_1["default"].sepAuthToken), processController.update);
    app.get('/data/favorite/:number/users', verifyBasicAuthentication(app_1["default"].sepAuthToken), processController.getUsersBySepProtocol);
    app.post('/data/favorite', processController.saveFavorite);
    app.get('/data/favorite', processController.getFavorite);
};

//# sourceMappingURL=process.js.map
