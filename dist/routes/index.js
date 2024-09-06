"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
const venue_1 = require("./venue");
const reservation_1 = require("./reservation");
exports.router = (0, express_1.Router)();
exports.router.use("/auth", auth_1.AuthRoute);
exports.router.use("/venues", venue_1.VenueRoute);
exports.router.use("/reservations", reservation_1.ReservationRoute);
//# sourceMappingURL=index.js.map