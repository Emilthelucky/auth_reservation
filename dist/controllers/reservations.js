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
exports.DeleteReservation = exports.GetReservationDetails = exports.GetUserReservations = exports.CreateReservation = void 0;
var reservation_1 = require("../models/reservation");
var venue_1 = require("../models/venue");
var APIError_1 = require("../errors/APIError");
var ErrorManager_1 = require("../helpers/managers/ErrorManager");
var nodemailer_1 = require("../libraries/nodemailer");
var user_1 = require("../models/user");
var logger_1 = __importDefault(require("../libraries/logger"));
var CreateReservation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, venueId, date, time, numberOfPeople, venue, reservationDate, existingReservation, user, newReservation, mailOptions, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, venueId = _a.venueId, date = _a.date, time = _a.time, numberOfPeople = _a.numberOfPeople;
                if (!venueId || !date || !time || !numberOfPeople) {
                    logger_1.default.error("Create reservation failed: Missing fields");
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "MISSING_FIELDS_ERROR"))];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, venue_1.VenueModel.findById(venueId)];
            case 2:
                venue = _b.sent();
                if (!venue) {
                    logger_1.default.error("Create reservation failed: Venue not found for ID ".concat(venueId));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "VENUE_NOT_FOUND_ERROR"))];
                }
                reservationDate = new Date(date);
                if (isNaN(reservationDate.getTime())) {
                    logger_1.default.error("Create reservation failed: Invalid date ".concat(date));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "INVALID_DATE_ERROR"))];
                }
                return [4 /*yield*/, reservation_1.ReservationModel.findOne({
                        venueId: venueId,
                        date: reservationDate.toISOString().split("T")[0],
                    })];
            case 3:
                existingReservation = _b.sent();
                if (existingReservation) {
                    logger_1.default.error("Create reservation failed: Time slot occupied for venue ".concat(venueId, " on ").concat(reservationDate.toISOString().split("T")[0]));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "TIME_SLOT_OCCUPIED_ERROR"))];
                }
                return [4 /*yield*/, user_1.UserModel.findById(req.user.userId)];
            case 4:
                user = _b.sent();
                return [4 /*yield*/, reservation_1.ReservationModel.create({
                        venueId: venueId,
                        date: reservationDate,
                        time: time,
                        numberOfPeople: numberOfPeople,
                        userId: user._id,
                    })];
            case 5:
                newReservation = _b.sent();
                mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: "Reservation Info",
                    text: "Your Reservation Has Successfully Reserved on ".concat(newReservation.date, " at ").concat(newReservation.time, " with ").concat(newReservation.numberOfPeople, " people"),
                };
                return [4 /*yield*/, nodemailer_1.transporter.sendMail(mailOptions)];
            case 6:
                _b.sent();
                logger_1.default.info("Reservation created successfully for user ".concat(user._id, " at venue ").concat(venueId));
                return [2 /*return*/, res.status(201).json({
                        message: "Reservation created successfully and information sent to your email!",
                        reservation: newReservation,
                    })];
            case 7:
                error_1 = _b.sent();
                logger_1.default.error("Create reservation failed: ".concat(error_1.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.CreateReservation = CreateReservation;
var GetUserReservations = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reservations, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, reservation_1.ReservationModel.find({
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
                    }).populate("venueId")];
            case 1:
                reservations = _b.sent();
                if (!reservations.length) {
                    logger_1.default.info("No reservations found for user ".concat(req.user.userId));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "NO_RESERVATION_FOUND"))];
                }
                logger_1.default.info("Retrieved reservations for user ".concat(req.user.userId));
                return [2 /*return*/, res.status(200).json({
                        message: "Reservations retrieved successfully!",
                        reservations: reservations,
                    })];
            case 2:
                error_2 = _b.sent();
                logger_1.default.error("Failed to get user reservations: ".concat(error_2.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.GetUserReservations = GetUserReservations;
var GetReservationDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, reservation, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!id) {
                    logger_1.default.error("Get reservation details failed: Missing reservation ID");
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "MISSING_RESERVATION_ID"))];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, reservation_1.ReservationModel.findById(id).populate("venueId")];
            case 2:
                reservation = _a.sent();
                if (!reservation) {
                    logger_1.default.error("Get reservation details failed: Reservation not found for ID ".concat(id));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "RESERVATION_NOT_FOUND"))];
                }
                if (req.user.role === "admin" ||
                    reservation.userId == req.user.userId) {
                    logger_1.default.info("Reservation details retrieved successfully for ID ".concat(id));
                    return [2 /*return*/, res.status(200).json({
                            message: "Reservation details retrieved successfully!",
                            reservation: reservation,
                        })];
                }
                logger_1.default.error("Get reservation details failed: Forbidden access to reservation ID ".concat(id, " by user ").concat(req.user.userId));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "FORBIDDEN_ERROR"))];
            case 3:
                error_3 = _a.sent();
                logger_1.default.error("Get reservation details failed: ".concat(error_3.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.GetReservationDetails = GetReservationDetails;
var DeleteReservation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, reservation, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!id) {
                    logger_1.default.error("Delete reservation failed: Missing reservation ID");
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "MISSING_RESERVATION_ID"))];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, reservation_1.ReservationModel.findById(id)];
            case 2:
                reservation = _a.sent();
                if (!reservation) {
                    logger_1.default.error("Delete reservation failed: Reservation not found for ID ".concat(id));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "RESERVATION_NOT_FOUND"))];
                }
                if (!(req.user.role === "admin" ||
                    reservation.userId == req.user.userId)) return [3 /*break*/, 4];
                return [4 /*yield*/, reservation_1.ReservationModel.findByIdAndDelete(id)];
            case 3:
                _a.sent();
                logger_1.default.info("Reservation deleted successfully for ID ".concat(id));
                return [2 /*return*/, res.status(200).json({
                        message: "Reservation deleted successfully!",
                    })];
            case 4:
                logger_1.default.error("Delete reservation failed: Forbidden access to delete reservation ID ".concat(id, " by user ").concat(req.user.userId));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "FORBIDDEN_ERROR"))];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                logger_1.default.error("Delete reservation failed: ".concat(error_4.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.DeleteReservation = DeleteReservation;
//# sourceMappingURL=reservations.js.map