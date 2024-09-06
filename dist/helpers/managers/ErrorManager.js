"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorManager = void 0;
var ErrorManager = /** @class */ (function () {
    function ErrorManager(res) {
        this.errorList = [];
        this.res = res;
    }
    ErrorManager.prototype.addError = function (error) {
        this.errorList.push(error);
    };
    ErrorManager.prototype.getErrors = function () {
        return this.errorList;
    };
    ErrorManager.prototype.handleError = function (error) {
        var _a;
        if (this.res.headersSent) {
            return;
        }
        var statusCode = error.statusCode, message = error.message, errorType = error.errorType;
        var payload = { statusCode: statusCode, message: message };
        return this.res.status(statusCode).json((_a = {}, _a[errorType] = payload, _a));
    };
    return ErrorManager;
}());
exports.ErrorManager = ErrorManager;
//# sourceMappingURL=ErrorManager.js.map