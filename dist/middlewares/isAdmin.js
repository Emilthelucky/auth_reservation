"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
var APIError_1 = require("../errors/APIError");
var ErrorManager_1 = require("../helpers/managers/ErrorManager");
var isAdmin = function (req, res, next) {
    var _a;
    var userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (userRole !== "admin") {
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "FORBIDDEN_ERROR"));
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map