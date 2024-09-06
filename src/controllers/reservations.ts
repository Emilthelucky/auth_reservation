import { Response } from "express"
import { AuthenticatedRequest } from "../types/index"
import { ReservationModel } from "../models/reservation"
import { VenueModel } from "../models/venue"
import { APIError } from "../errors/APIError"
import { ErrorManager as errorHandler } from "../helpers/managers/ErrorManager"
import { transporter } from "../libraries/nodemailer"
import { UserModel } from "../models/user"
import logger from "../libraries/logger"

export const CreateReservation = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { venueId, date, time, numberOfPeople } = req.body

    if (!venueId || !date || !time || !numberOfPeople) {
        logger.error("Create reservation failed: Missing fields")
        return new errorHandler(res).handleError(
            new APIError("system", "reservation", "MISSING_FIELDS_ERROR")
        )
    }

    try {
        const venue = await VenueModel.findById(venueId)
        if (!venue) {
            logger.error(
                `Create reservation failed: Venue not found for ID ${venueId}`
            )
            return new errorHandler(res).handleError(
                new APIError("system", "venue", "VENUE_NOT_FOUND_ERROR")
            )
        }

        const reservationDate = new Date(date)
        if (isNaN(reservationDate.getTime())) {
            logger.error(`Create reservation failed: Invalid date ${date}`)
            return new errorHandler(res).handleError(
                new APIError("system", "reservation", "INVALID_DATE_ERROR")
            )
        }

        const existingReservation = await ReservationModel.findOne({
            venueId,
            date: reservationDate.toISOString().split("T")[0],
        })

        if (existingReservation) {
            logger.error(
                `Create reservation failed: Time slot occupied for venue ${venueId} on ${
                    reservationDate.toISOString().split("T")[0]
                }`
            )
            return new errorHandler(res).handleError(
                new APIError(
                    "system",
                    "reservation",
                    "TIME_SLOT_OCCUPIED_ERROR"
                )
            )
        }

        const user = await UserModel.findById(req.user.userId)

        const newReservation = await ReservationModel.create({
            venueId,
            date: reservationDate,
            time,
            numberOfPeople,
            userId: user._id,
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reservation Info",
            text: `Your Reservation Has Successfully Reserved on ${newReservation.date} at ${newReservation.time} with ${newReservation.numberOfPeople} people`,
        }

        await transporter.sendMail(mailOptions)

        logger.info(
            `Reservation created successfully for user ${user._id} at venue ${venueId}`
        )
        return res.status(201).json({
            message:
                "Reservation created successfully and information sent to your email!",
            reservation: newReservation,
        })
    } catch (error) {
        logger.error(`Create reservation failed: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}

export const GetUserReservations = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const reservations = await ReservationModel.find({
            userId: req.user?.userId,
        }).populate("venueId")

        if (!reservations.length) {
            logger.info(`No reservations found for user ${req.user.userId}`)
            return new errorHandler(res).handleError(
                new APIError("system", "reservation", "NO_RESERVATION_FOUND")
            )
        }

        logger.info(`Retrieved reservations for user ${req.user.userId}`)
        return res.status(200).json({
            message: "Reservations retrieved successfully!",
            reservations,
        })
    } catch (error) {
        logger.error(`Failed to get user reservations: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}

export const GetReservationDetails = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { id } = req.params

    if (!id) {
        logger.error("Get reservation details failed: Missing reservation ID")
        return new errorHandler(res).handleError(
            new APIError("system", "reservation", "MISSING_RESERVATION_ID")
        )
    }

    try {
        const reservation = await ReservationModel.findById(id).populate(
            "venueId"
        )

        if (!reservation) {
            logger.error(
                `Get reservation details failed: Reservation not found for ID ${id}`
            )
            return new errorHandler(res).handleError(
                new APIError("system", "reservation", "RESERVATION_NOT_FOUND")
            )
        }

        if (
            req.user.role === "admin" ||
            reservation.userId == req.user.userId
        ) {
            logger.info(
                `Reservation details retrieved successfully for ID ${id}`
            )
            return res.status(200).json({
                message: "Reservation details retrieved successfully!",
                reservation,
            })
        }

        logger.error(
            `Get reservation details failed: Forbidden access to reservation ID ${id} by user ${req.user.userId}`
        )
        return new errorHandler(res).handleError(
            new APIError("system", "authorization", "FORBIDDEN_ERROR")
        )
    } catch (error) {
        logger.error(`Get reservation details failed: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}

export const DeleteReservation = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const { id } = req.params

    if (!id) {
        logger.error("Delete reservation failed: Missing reservation ID")
        return new errorHandler(res).handleError(
            new APIError("system", "reservation", "MISSING_RESERVATION_ID")
        )
    }

    try {
        const reservation = await ReservationModel.findById(id)

        if (!reservation) {
            logger.error(
                `Delete reservation failed: Reservation not found for ID ${id}`
            )
            return new errorHandler(res).handleError(
                new APIError("system", "reservation", "RESERVATION_NOT_FOUND")
            )
        }

        if (
            req.user.role === "admin" ||
            reservation.userId == req.user.userId
        ) {
            await ReservationModel.findByIdAndDelete(id)
            logger.info(`Reservation deleted successfully for ID ${id}`)
            return res.status(200).json({
                message: "Reservation deleted successfully!",
            })
        } else {
            logger.error(
                `Delete reservation failed: Forbidden access to delete reservation ID ${id} by user ${req.user.userId}`
            )
            return new errorHandler(res).handleError(
                new APIError("system", "authorization", "FORBIDDEN_ERROR")
            )
        }
    } catch (error) {
        logger.error(`Delete reservation failed: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}
