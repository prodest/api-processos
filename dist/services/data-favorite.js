"use strict";
var rethinkdb_1 = require("../config/rethinkdb");
var prodest_espm_storage_1 = require("prodest-espm-storage");
var DataFavorite = (function () {
    function DataFavorite(dataService) {
        if (dataService === void 0) { dataService = new prodest_espm_storage_1.DataService(); }
        this.dataService = dataService;
        this.entityName = 'favoriteSepProtocol';
        this.entity = undefined;
        this.dataService = new prodest_espm_storage_1.DataService(rethinkdb_1["default"].host, rethinkdb_1["default"].port, rethinkdb_1["default"].authKey, rethinkdb_1["default"].db);
        var type = this.dataService.thinkTypes;
        var model = {
            favoriteProcess: [type.number()]
        };
        var indexes = [
            {
                name: 'favoriteProcess',
                options: { multi: true }
            }
        ];
        this.entity = this.dataService.defineResource(this.entityName, model, indexes);
    }
    DataFavorite.prototype.saveFavorite = function (data) {
        return this.dataService.save(this.entity, data);
    };
    DataFavorite.prototype.getFavorite = function (sub) {
        return this.dataService.get(this.entity, sub);
    };
    DataFavorite.prototype.getUsersBySepProtocol = function (number) {
        return this.dataService.getAll(this.entity, number, 'favoriteProcess', function (item) { return item.id; });
    };
    return DataFavorite;
}());
exports.DataFavorite = DataFavorite;

//# sourceMappingURL=data-favorite.js.map
