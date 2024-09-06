"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jwt_1 = require("../libraries/jwt");
const APIError_1 = require("../errors/APIError");
const ErrorManager_1 = require("../helpers/managers/ErrorManager");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "MISSING_AUTHORIZATION_ERROR"));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, jwt_1.VerifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "INVALID_AUTHORIZATION_ERROR"));
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "EXPIRED_AUTHORIZATION_ERROR"));
        }
        else {
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
        }
    }
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map