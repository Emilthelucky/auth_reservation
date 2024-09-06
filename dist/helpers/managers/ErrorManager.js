"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorManager = void 0;
class ErrorManager {
    errorList = [];
    res;
    constructor(res) {
        this.res = res;
    }
    addError(error) {
        this.errorList.push(error);
    }
    getErrors() {
        return this.errorList;
    }
    handleError(error) {
        if (this.res.headersSent) {
            return;
        }
        const { statusCode, message, errorType } = error;
        const payload = { statusCode, message };
        return this.res.status(statusCode).json({ [errorType]: payload });
    }
}
exports.ErrorManager = ErrorManager;
//# sourceMappingURL=ErrorManager.js.map