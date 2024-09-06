"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparePassword = exports.HashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const HashPassword = async (enteredPassword) => {
    const salt = await bcryptjs_1.default.genSalt(12);
    const hashedPassword = await bcryptjs_1.default.hash(enteredPassword, salt);
    return hashedPassword;
};
exports.HashPassword = HashPassword;
const ComparePassword = async (enteredPassword, realPassword) => {
    const check = await bcryptjs_1.default.compare(enteredPassword, realPassword);
    return check;
};
exports.ComparePassword = ComparePassword;
//# sourceMappingURL=bcrypt.js.map