"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsers = exports.login = exports.register = void 0;
const ValidateFields_1 = require("../utils/ValidateFields");
const user_1 = require("../models/user");
const APIError_1 = require("../errors/APIError");
const ErrorManager_1 = require("../helpers/managers/ErrorManager");
const bcrypt_1 = require("../libraries/bcrypt");
const EmailValidation_1 = require("../utils/EmailValidation");
const StrongPassword_1 = require("../utils/StrongPassword");
const jwt_1 = require("../libraries/jwt");
const logger_1 = __importDefault(require("../libraries/logger"));
const register = async (req, res) => {
    logger_1.default.info(`Register attempt: ${JSON.stringify(req.body)}`);
    const { username, email, password, role } = req.body;
    (0, ValidateFields_1.ValidateField)("USERNAME", username, res);
    (0, ValidateFields_1.ValidateField)("EMAIL", email, res);
    (0, ValidateFields_1.ValidateField)("PASSWORD", password, res);
    if (!(0, EmailValidation_1.ValidateEamil)(email)) {
        logger_1.default.error(`Registration failed: Invalid email ${email}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "INVALID_EMAIL_ERROR"));
    }
    if (!(0, StrongPassword_1.ValidateStrongPassword)(password)) {
        logger_1.default.error(`Registration failed: Weak password for email ${email}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "NOT_STRONG_PASSWORD_ERROR"));
    }
    const validRoles = ["user", "admin"];
    if (role && !validRoles.includes(role)) {
        logger_1.default.error(`Registration failed: Invalid role ${role}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "INVALID_ROLE_ERROR"));
    }
    const existingUser = await user_1.UserModel.findOne({
        $or: [{ email }, { username }],
    });
    if (existingUser) {
        if (existingUser.email === email) {
            logger_1.default.error(`Registration failed: Email already exists ${email}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "EMAIL_FOUND_ERROR"));
        }
        if (existingUser.username === username) {
            logger_1.default.error(`Registration failed: Username already exists ${username}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "USERNAME_FOUND_ERROR"));
        }
    }
    const userRole = role && validRoles.includes(role) ? role : "user";
    const hashedP = await (0, bcrypt_1.HashPassword)(password);
    const newUser = await user_1.UserModel.create({
        username,
        email,
        password: hashedP,
        role: userRole,
    });
    logger_1.default.info(`User registered successfully: ${username}`);
    return res.status(200).json({
        message: "User Registered Successfully!",
    });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        logger_1.default.error(`Login failed: Missing fields for email ${email}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "MISSING_FIELDS_ERROR"));
    }
    const user = await user_1.UserModel.findOne({ email });
    if (!user) {
        logger_1.default.error(`Login failed: User not found for email ${email}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "USER_NOT_FOUND_ERROR"));
    }
    const isPasswordValid = await (0, bcrypt_1.ComparePassword)(password, user.password);
    if (!isPasswordValid) {
        logger_1.default.error(`Login failed: Incorrect password for email ${email}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authentication", "INCORRECT_PASSWORD_ERROR"));
    }
    const accessToken = (0, jwt_1.GenerateToken)(user._id, user.role);
    logger_1.default.info(`User logged in successfully: ${user.username}`);
    return res.status(200).json({
        message: "User has successfully logged in!",
        accessToken,
    });
};
exports.login = login;
const GetAllUsers = async (req, res) => {
    try {
        const users = await user_1.UserModel.find({});
        logger_1.default.info(`Fetched all users: ${users.length} users found`);
        return res.status(200).json(users);
    }
    catch (error) {
        logger_1.default.error(`Failed to fetch users: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "DATABASE_ERROR"));
    }
};
exports.GetAllUsers = GetAllUsers;
//# sourceMappingURL=user.js.map