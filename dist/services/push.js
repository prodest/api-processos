"use strict";
var request_promise_1 = require("request-promise");
var PushService = (function () {
    function PushService(url, username, password) {
        this._url = '';
        this._username = '';
        this._password = '';
        this._url = url;
        this._username = username;
        this._password = password;
    }
    ;
    PushService.prototype.sendRequest = function (data, authorization) {
        var options = {
            method: 'POST',
            uri: this._url,
            body: data,
            json: true,
            headers: {
                'Authorization': authorization
            }
        };
        return request_promise_1["default"](options);
    };
    ;
    PushService.prototype.send = function (users, message, state, stateParams, icon) {
        var authorization = 'Basic ' + Buffer.from(this._username + ':' + this._password).toString('base64');
        var pushData = {
            users: users,
            message: message,
            state: state,
            params: stateParams,
            icon: icon
        };
        this.sendRequest(pushData, authorization);
    };
    ;
    return PushService;
}());
exports.PushService = PushService;

//# sourceMappingURL=push.js.map
