"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteReservation = exports.GetReservationDetails = exports.GetUserReservations = exports.CreateReservation = void 0;
const reservation_1 = require("../models/reservation");
const venue_1 = require("../models/venue");
const APIError_1 = require("../errors/APIError");
const ErrorManager_1 = require("../helpers/managers/ErrorManager");
const nodemailer_1 = require("../libraries/nodemailer");
const user_1 = require("../models/user");
const logger_1 = __importDefault(require("../libraries/logger"));
const CreateReservation = async (req, res) => {
    const { venueId, date, time, numberOfPeople } = req.body;
    if (!venueId || !date || !time || !numberOfPeople) {
        logger_1.default.error("Create reservation failed: Missing fields");
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "MISSING_FIELDS_ERROR"));
    }
    try {
        const venue = await venue_1.VenueModel.findById(venueId);
        if (!venue) {
            logger_1.default.error(`Create reservation failed: Venue not found for ID ${venueId}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "VENUE_NOT_FOUND_ERROR"));
        }
        const reservationDate = new Date(date);
        if (isNaN(reservationDate.getTime())) {
            logger_1.default.error(`Create reservation failed: Invalid date ${date}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "INVALID_DATE_ERROR"));
        }
        const existingReservation = await reservation_1.ReservationModel.findOne({
            venueId,
            date: reservationDate.toISOString().split("T")[0],
        });
        if (existingReservation) {
            logger_1.default.error(`Create reservation failed: Time slot occupied for venue ${venueId} on ${reservationDate.toISOString().split("T")[0]}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "TIME_SLOT_OCCUPIED_ERROR"));
        }
        const user = await user_1.UserModel.findById(req.user.userId);
        const newReservation = await reservation_1.ReservationModel.create({
            venueId,
            date: reservationDate,
            time,
            numberOfPeople,
            userId: user._id,
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reservation Info",
            text: `Your Reservation Has Successfully Reserved on ${newReservation.date} at ${newReservation.time} with ${newReservation.numberOfPeople} people`,
        };
        await nodemailer_1.transporter.sendMail(mailOptions);
        logger_1.default.info(`Reservation created successfully for user ${user._id} at venue ${venueId}`);
        return res.status(201).json({
            message: "Reservation created successfully and information sent to your email!",
            reservation: newReservation,
        });
    }
    catch (error) {
        logger_1.default.error(`Create reservation failed: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.CreateReservation = CreateReservation;
const GetUserReservations = async (req, res) => {
    try {
        const reservations = await reservation_1.ReservationModel.find({
            userId: req.user?.userId,
        }).populate("venueId");
        if (!reservations.length) {
            logger_1.default.info(`No reservations found for user ${req.user.userId}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "NO_RESERVATION_FOUND"));
        }
        logger_1.default.info(`Retrieved reservations for user ${req.user.userId}`);
        return res.status(200).json({
            message: "Reservations retrieved successfully!",
            reservations,
        });
    }
    catch (error) {
        logger_1.default.error(`Failed to get user reservations: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.GetUserReservations = GetUserReservations;
const GetReservationDetails = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        logger_1.default.error("Get reservation details failed: Missing reservation ID");
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "MISSING_RESERVATION_ID"));
    }
    try {
        const reservation = await reservation_1.ReservationModel.findById(id).populate("venueId");
        if (!reservation) {
            logger_1.default.error(`Get reservation details failed: Reservation not found for ID ${id}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "RESERVATION_NOT_FOUND"));
        }
        if (req.user.role === "admin" ||
            reservation.userId == req.user.userId) {
            logger_1.default.info(`Reservation details retrieved successfully for ID ${id}`);
            return res.status(200).json({
                message: "Reservation details retrieved successfully!",
                reservation,
            });
        }
        logger_1.default.error(`Get reservation details failed: Forbidden access to reservation ID ${id} by user ${req.user.userId}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "FORBIDDEN_ERROR"));
    }
    catch (error) {
        logger_1.default.error(`Get reservation details failed: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.GetReservationDetails = GetReservationDetails;
const DeleteReservation = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        logger_1.default.error("Delete reservation failed: Missing reservation ID");
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "MISSING_RESERVATION_ID"));
    }
    try {
        const reservation = await reservation_1.ReservationModel.findById(id);
        if (!reservation) {
            logger_1.default.error(`Delete reservation failed: Reservation not found for ID ${id}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "reservation", "RESERVATION_NOT_FOUND"));
        }
        if (req.user.role === "admin" ||
            reservation.userId == req.user.userId) {
            await reservation_1.ReservationModel.findByIdAndDelete(id);
            logger_1.default.info(`Reservation deleted successfully for ID ${id}`);
            return res.status(200).json({
                message: "Reservation deleted successfully!",
            });
        }
        else {
            logger_1.default.error(`Delete reservation failed: Forbidden access to delete reservation ID ${id} by user ${req.user.userId}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "authorization", "FORBIDDEN_ERROR"));
        }
    }
    catch (error) {
        logger_1.default.error(`Delete reservation failed: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.DeleteReservation = DeleteReservation;
//# sourceMappingURL=reservations.js.map