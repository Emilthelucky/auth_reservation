"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = exports.GenerateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const GenerateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, SECRET_KEY, { expiresIn: "1d" });
};
exports.GenerateToken = GenerateToken;
const VerifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    catch (err) {
        throw err;
    }
};
exports.VerifyToken = VerifyToken;
//# sourceMappingURL=jwt.js.map