"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateField = void 0;
var APIError_1 = require("../errors/APIError");
var ErrorManager_1 = require("../helpers/managers/ErrorManager");
var ValidateField = function (key, value, res) {
    if (!value) {
        switch (key) {
            case "USERNAME":
                return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "MISSING_USERNAME_ERROR"));
            case "EMAIL":
                return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "MISSING_EMAIL_ERROR"));
            case "PASSWORD":
                return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "MISSING_PASSWORD_ERROR"));
        }
    }
};
exports.ValidateField = ValidateField;
//# sourceMappingURL=ValidateFields.js.map