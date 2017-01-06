"use strict";
var soap_as_promised_1 = require("soap-as-promised");
var app_1 = require("../config/app");
var SepService = (function () {
    function SepService() {
    }
    SepService.prototype.getDocumentInfo = function (processNumber) {
        var args = { numeroProcesso: processNumber };
        return soap_as_promised_1["default"].createClient(app_1["default"].service_url)
            .then(function (client) { return client.ConsultarProcessoSimplesPorNumero(args); });
    };
    ;
    return SepService;
}());
exports.SepService = SepService;

//# sourceMappingURL=sep.js.map
