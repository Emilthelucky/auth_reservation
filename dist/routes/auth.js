"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const user_1 = require("../controllers/user");
const express_1 = require("express");
const isAuth_1 = require("../middlewares/isAuth");
exports.AuthRoute = (0, express_1.Router)();
exports.AuthRoute.post("/register", user_1.register);
exports.AuthRoute.post("/login", user_1.login);
exports.AuthRoute.get("/users", isAuth_1.isAuth, user_1.GetAllUsers);
//# sourceMappingURL=auth.js.map