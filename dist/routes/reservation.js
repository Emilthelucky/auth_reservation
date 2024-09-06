"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationRoute = void 0;
const express_1 = require("express");
const reservations_1 = require("../controllers/reservations");
const isAuth_1 = require("../middlewares/isAuth");
exports.ReservationRoute = (0, express_1.Router)();
exports.ReservationRoute.post("/", isAuth_1.isAuth, reservations_1.CreateReservation);
exports.ReservationRoute.get("/", isAuth_1.isAuth, reservations_1.GetUserReservations);
exports.ReservationRoute.get("/:id", isAuth_1.isAuth, reservations_1.GetReservationDetails);
exports.ReservationRoute.delete("/:id", isAuth_1.isAuth, reservations_1.DeleteReservation);
//# sourceMappingURL=reservation.js.map