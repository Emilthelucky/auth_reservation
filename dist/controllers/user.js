"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsers = exports.login = exports.register = void 0;
var ValidateFields_1 = require("../utils/ValidateFields");
var user_1 = require("../models/user");
var APIError_1 = require("../errors/APIError");
var ErrorManager_1 = require("../helpers/managers/ErrorManager");
var bcrypt_1 = require("../libraries/bcrypt");
var EmailValidation_1 = require("../utils/EmailValidation");
var StrongPassword_1 = require("../utils/StrongPassword");
var jwt_1 = require("../libraries/jwt");
var logger_1 = __importDefault(require("../libraries/logger"));
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, role, validRoles, existingUser, userRole, hashedP, newUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                logger_1.default.info("Register attempt: ".concat(JSON.stringify(req.body)));
                _a = req.body, username = _a.username, email = _a.email, password = _a.password, role = _a.role;
                (0, ValidateFields_1.ValidateField)("USERNAME", username, res);
                (0, ValidateFields_1.ValidateField)("EMAIL", email, res);
                (0, ValidateFields_1.ValidateField)("PASSWORD", password, res);
                if (!(0, EmailValidation_1.ValidateEamil)(email)) {
                    logger_1.default.error("Registration failed: Invalid email ".concat(email));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "INVALID_EMAIL_ERROR"))];
                }
                if (!(0, StrongPassword_1.ValidateStrongPassword)(password)) {
                    logger_1.default.error("Registration failed: Weak password for email ".concat(email));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "NOT_STRONG_PASSWORD_ERROR"))];
                }
                validRoles = ["user", "admin"];
                if (role && !validRoles.includes(role)) {
                    logger_1.default.error("Registration failed: Invalid role ".concat(role));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "INVALID_ROLE_ERROR"))];
                }
                return [4 /*yield*/, user_1.UserModel.findOne({
                        $or: [{ email: email }, { username: username }],
                    })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    if (existingUser.email === email) {
                        logger_1.default.error("Registration failed: Email already exists ".concat(email));
                        return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "EMAIL_FOUND_ERROR"))];
                    }
                    if (existingUser.username === username) {
                        logger_1.default.error("Registration failed: Username already exists ".concat(username));
                        return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "USERNAME_FOUND_ERROR"))];
                    }
                }
                userRole = role && validRoles.includes(role) ? role : "user";
                return [4 /*yield*/, (0, bcrypt_1.HashPassword)(password)];
            case 2:
                hashedP = _b.sent();
                return [4 /*yield*/, user_1.UserModel.create({
                        username: username,
                        email: email,
                        password: hashedP,
                        role: userRole,
                    })];
            case 3:
                newUser = _b.sent();
                logger_1.default.info("User registered successfully: ".concat(username));
                return [2 /*return*/, res.status(200).json({
                        message: "User Registered Successfully!",
                    })];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid, accessToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    logger_1.default.error("Login failed: Missing fields for email ".concat(email));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "MISSING_FIELDS_ERROR"))];
                }
                return [4 /*yield*/, user_1.UserModel.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    logger_1.default.error("Login failed: User not found for email ".concat(email));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "USER_NOT_FOUND_ERROR"))];
                }
                return [4 /*yield*/, (0, bcrypt_1.ComparePassword)(password, user.password)];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    logger_1.default.error("Login failed: Incorrect password for email ".concat(email));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "INCORRECT_PASSWORD_ERROR"))];
                }
                accessToken = (0, jwt_1.GenerateToken)(user._id, user.role);
                logger_1.default.info("User logged in successfully: ".concat(user.username));
                return [2 /*return*/, res.status(200).json({
                        message: "User has successfully logged in!",
                        accessToken: accessToken,
                    })];
        }
    });
}); };
exports.login = login;
var GetAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.UserModel.find({})];
            case 1:
                users = _a.sent();
                logger_1.default.info("Fetched all users: ".concat(users.length, " users found"));
                return [2 /*return*/, res.status(200).json(users)];
            case 2:
                error_1 = _a.sent();
                logger_1.default.error("Failed to fetch users: ".concat(error_1.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "DATABASE_ERROR"))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.GetAllUsers = GetAllUsers;
//# sourceMappingURL=user.js.map