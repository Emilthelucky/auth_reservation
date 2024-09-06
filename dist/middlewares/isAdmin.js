"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const APIError_1 = require("../errors/APIError");
const ErrorManager_1 = require("../helpers/managers/ErrorManager");
const isAdmin = (req, res, next) => {
    const userRole = req.user?.role;
    if (userRole !== "admin") {
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "FORBIDDEN_ERROR"));
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map