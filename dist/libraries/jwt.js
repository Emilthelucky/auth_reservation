"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = exports.GenerateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var SECRET_KEY = process.env.JWT_SECRET_KEY;
var GenerateToken = function (userId, role) {
    return jsonwebtoken_1.default.sign({ userId: userId, role: role }, SECRET_KEY, { expiresIn: "1d" });
};
exports.GenerateToken = GenerateToken;
var VerifyToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    catch (err) {
        throw err;
    }
};
exports.VerifyToken = VerifyToken;
//# sourceMappingURL=jwt.js.map