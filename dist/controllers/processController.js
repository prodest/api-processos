"use strict";
var moment_1 = require("moment");
var push_1 = require("../config/push");
var app_1 = require("../config/app");
var data_favorite_1 = require("../services/data-favorite");
var push_2 = require("../services/push");
var sep_1 = require("../services/sep");
var ProcessController = (function () {
    function ProcessController(sepService, dataFavorite) {
        if (sepService === void 0) { sepService = new sep_1.SepService(); }
        if (dataFavorite === void 0) { dataFavorite = new data_favorite_1.DataFavorite(); }
        var _this = this;
        this.sepService = sepService;
        this.dataFavorite = dataFavorite;
        this.processController = new Object();
        this.dataService = undefined;
        this.pushService = undefined;
        this.getSingle = function (req, res, next) {
            var procNumber = req.params.number;
            var mask = /^\d{2,8}$/;
            if (!mask.test(procNumber)) {
                return _this.wrongNumber(next);
            }
            _this.sepService.getDocumentInfo(procNumber)
                .then(function (result) {
                if (!result || typeof result !== 'object') {
                    throw new Error('Result not expected.');
                }
                var p = result.ProcessoHistorico;
                if (!p.Interessado) {
                    return _this.notFound(next);
                }
                var updates = p.Andamento.ProcessoLocalizacao.map(function (a) {
                    return {
                        date: moment_1["default"](a.Data, 'DD/MM/YYYY HH:mm'),
                        agency: a.Orgao,
                        area: a.Local,
                        status: a.Situacao
                    };
                });
                var info = {
                    number: p.NumeroProcesso,
                    parts: p.Interessado.string,
                    subject: p.Assunto,
                    summary: p.Resumo,
                    status: p.Situacao,
                    updates: updates,
                    district: p.Municipio,
                    extra: p.IdentificacoesDiversas,
                    pageUrl: app_1["default"].url_web + p.NumeroProcesso
                };
                return res.json(info);
            })["catch"](function (err) {
                next(err);
            });
        };
        this.pushService = new push_2.PushService(push_1["default"].push_url, push_1["default"].username, push_1["default"].password);
    }
    ProcessController.prototype.notFound = function (next) {
        var error = new Error('Processo não encontrado.');
        error.userMessage = error.message;
        error.handled = true;
        error.status = 404;
        next(error);
    };
    ProcessController.prototype.wrongNumber = function (next) {
        var error = new Error('O número do processo deve possuir apenas números e ter entre 2 e 8 dígitos.');
        error.userMessage = error.message;
        error.handled = true;
        error.status = 400;
        return next(error);
    };
    ProcessController.prototype.update = function (req, res, next) {
        var _this = this;
        var data = req.body;
        this.getUsersBySepProtocol(req, res, next)
            .then(function (usersToPush) {
            var message = "Processo " + data.number + " atualizado";
            var state = 'app.sepConsulta/:processNumber';
            var params = { processNumber: "" + data.number };
            return _this.pushService.send(usersToPush, message, state, params);
        })
            .then(function () { return res.send('ok'); })["catch"](function (error) { return next(error); });
    };
    ProcessController.prototype.saveFavorite = function (req, res, next) {
        var data = req.body;
        data.id = parseInt(req.decodedToken.sub);
        delete data.userId;
        return this.dataFavorite.saveFavorite(data)
            .then(function (data) { return res.send(data); })["catch"](function (error) { return next(error); });
    };
    ProcessController.prototype.getFavorite = function (req, res, next) {
        var sub = parseInt(req.decodedToken.sub);
        return this.dataFavorite.saveFavorite(sub)
            .then(function (data) { return res.send(data); })["catch"](function (error) { return next(error); });
    };
    ProcessController.prototype.getUsersBySepProtocol = function (req, res, next) {
        var number = parseInt(req.params.number);
        return this.dataFavorite.getUsersBySepProtocol(number)
            .then(function (data) { return res.send(data); })["catch"](function (error) { return next(error); });
    };
    return ProcessController;
}());
exports.ProcessController = ProcessController;

//# sourceMappingURL=processController.js.map
