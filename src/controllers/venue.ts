import { Request, Response } from "express"
import { AuthenticatedRequest } from "../types/index"
import { VenueModel } from "../models/venue"
import { APIError } from "../errors/APIError"
import { ErrorManager as errorHandler } from "../helpers/managers/ErrorManager"
// import { redisClient } from "../libraries/redis"
import logger from "../libraries/logger"

export const CreateVenue = async (req: AuthenticatedRequest, res: Response) => {
    const { name, location, capacity, description } = req.body

    if (!name || !location || !capacity || !description) {
        logger.error("Create venue failed: Missing fields")
        return new errorHandler(res).handleError(
            new APIError("system", "venue", "MISSING_FIELDS_ERROR")
        )
    }

    logger.info(`Creating venue by user ${req.user?.userId}`)

    try {
        const newVenue = await VenueModel.create({
            name,
            location,
            capacity,
            description,
            createdBy: req.user?.userId,
        })

        // await redisClient.del("venues")

        logger.info(`Venue created successfully: ${newVenue._id}`)
        return res.status(201).json({
            message: "Venue created successfully!",
            venue: newVenue,
        })
    } catch (error) {
        logger.error(`Create venue failed: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}

export const GetVenues = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, location } = req.query

    const pageNumber = parseInt(page as string, 10)
    const pageSize = parseInt(limit as string, 10)
    const skip = (pageNumber - 1) * pageSize

    const filters: any = {}
    if (location && location !== "") {
        filters.location = location
    }

    try {
        // const cachedVenues = await redisClient.get("venues")
        // if (cachedVenues) {
        //     logger.info("Venues fetched successfully from cache")
        //     return res.status(200).json({
        //         message: "Venues fetched successfully from cache!",
        //         venues: JSON.parse(cachedVenues),
        //     })
        // }

        const [venues, total] = await Promise.all([
            VenueModel.find(filters).skip(skip).limit(pageSize),
            VenueModel.countDocuments(filters),
        ])

        // await redisClient.set("venues", JSON.stringify(venues), { EX: 3600 })

        logger.info("Venues fetched successfully from database")
        return res.status(200).json({
            message: "Venues fetched successfully!",
            total,
            page: pageNumber,
            limit: pageSize,
            venues,
        })
    } catch (error) {
        logger.error(`Get venues failed: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}

export const GetVenueById = async (req: Request, res: Response) => {
    const venueId = req.params.id

    if (!venueId) {
        logger.error("Get venue by ID failed: Missing venue ID")
        return new errorHandler(res).handleError(
            new APIError("system", "venue", "MISSING_ID_ERROR")
        )
    }

    try {
        // const cachedVenue = await redisClient.get(`venue_${venueId}`)
        // if (cachedVenue) {
        //     logger.info(
        //         `Venue details fetched successfully from cache for ID ${venueId}`
        //     )
        //     return res.status(200).json({
        //         message: "Venue details fetched successfully from cache!",
        //         venue: JSON.parse(cachedVenue),
        //     })
        // }

        const venue = await VenueModel.findById(venueId)

        if (!venue) {
            logger.error(
                `Get venue by ID failed: Venue not found for ID ${venueId}`
            )
            return new errorHandler(res).handleError(
                new APIError("system", "venue", "VENUE_NOT_FOUND_ERROR")
            )
        }

        // await redisClient.set(`venue_${venueId}`, JSON.stringify(venue), {
        //     EX: 3600,
        // })

        logger.info(`Venue details fetched successfully for ID ${venueId}`)
        return res.status(200).json({
            message: "Venue details fetched successfully!",
            venue,
        })
    } catch (error) {
        logger.error(`Get venue by ID failed: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}

export const UpdateVenue = async (req: Request, res: Response) => {
    const venueId = req.params.id
    const { name, location, capacity, description } = req.body

    if (!venueId) {
        logger.error("Update venue failed: Missing venue ID")
        return new errorHandler(res).handleError(
            new APIError("system", "venue", "MISSING_ID_ERROR")
        )
    }

    try {
        const updatedVenue = await VenueModel.findByIdAndUpdate(
            venueId,
            { name, location, capacity, description },
            { new: true }
        )

        if (!updatedVenue) {
            logger.error(
                `Update venue failed: Venue not found for ID ${venueId}`
            )
            return new errorHandler(res).handleError(
                new APIError("system", "venue", "VENUE_NOT_FOUND_ERROR")
            )
        }

        // await redisClient.del(`venue_${venueId}`)
        // await redisClient.del("venues")

        logger.info(`Venue updated successfully for ID ${venueId}`)
        return res.status(200).json({
            message: "Venue updated successfully!",
            venue: updatedVenue,
        })
    } catch (error) {
        logger.error(`Update venue failed: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}

export const DeleteVenue = async (req: Request, res: Response) => {
    const venueId = req.params.id

    if (!venueId) {
        logger.error("Delete venue failed: Missing venue ID")
        return new errorHandler(res).handleError(
            new APIError("system", "venue", "MISSING_ID_ERROR")
        )
    }

    try {
        const deletedVenue = await VenueModel.findByIdAndDelete(venueId)

        if (!deletedVenue) {
            logger.error(
                `Delete venue failed: Venue not found for ID ${venueId}`
            )
            return new errorHandler(res).handleError(
                new APIError("system", "venue", "VENUE_NOT_FOUND_ERROR")
            )
        }

        // await redisClient.del(`venue_${venueId}`)
        // await redisClient.del("venues")

        logger.info(`Venue deleted successfully for ID ${venueId}`)
        return res.status(200).json({
            message: "Venue deleted successfully!",
            venue: deletedVenue,
        })
    } catch (error) {
        logger.error(`Delete venue failed: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "INERTIAL_SERVER_ERROR")
        )
    }
}
