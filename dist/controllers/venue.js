"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteVenue = exports.UpdateVenue = exports.GetVenueById = exports.GetVenues = exports.CreateVenue = void 0;
const venue_1 = require("../models/venue");
const APIError_1 = require("../errors/APIError");
const ErrorManager_1 = require("../helpers/managers/ErrorManager");
const redis_1 = require("../libraries/redis");
const logger_1 = __importDefault(require("../libraries/logger"));
const CreateVenue = async (req, res) => {
    const { name, location, capacity, description } = req.body;
    if (!name || !location || !capacity || !description) {
        logger_1.default.error("Create venue failed: Missing fields");
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "MISSING_FIELDS_ERROR"));
    }
    logger_1.default.info(`Creating venue by user ${req.user?.userId}`);
    try {
        const newVenue = await venue_1.VenueModel.create({
            name,
            location,
            capacity,
            description,
            createdBy: req.user?.userId,
        });
        await redis_1.redisClient.del("venues");
        logger_1.default.info(`Venue created successfully: ${newVenue._id}`);
        return res.status(201).json({
            message: "Venue created successfully!",
            venue: newVenue,
        });
    }
    catch (error) {
        logger_1.default.error(`Create venue failed: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.CreateVenue = CreateVenue;
const GetVenues = async (req, res) => {
    const { page = 1, limit = 10, location } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;
    const filters = {};
    if (location && location !== "") {
        filters.location = location;
    }
    try {
        const cachedVenues = await redis_1.redisClient.get("venues");
        if (cachedVenues) {
            logger_1.default.info("Venues fetched successfully from cache");
            return res.status(200).json({
                message: "Venues fetched successfully from cache!",
                venues: JSON.parse(cachedVenues),
            });
        }
        const [venues, total] = await Promise.all([
            venue_1.VenueModel.find(filters).skip(skip).limit(pageSize),
            venue_1.VenueModel.countDocuments(filters),
        ]);
        await redis_1.redisClient.set("venues", JSON.stringify(venues), { EX: 3600 });
        logger_1.default.info("Venues fetched successfully from database");
        return res.status(200).json({
            message: "Venues fetched successfully!",
            total,
            page: pageNumber,
            limit: pageSize,
            venues,
        });
    }
    catch (error) {
        logger_1.default.error(`Get venues failed: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.GetVenues = GetVenues;
const GetVenueById = async (req, res) => {
    const venueId = req.params.id;
    if (!venueId) {
        logger_1.default.error("Get venue by ID failed: Missing venue ID");
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "MISSING_ID_ERROR"));
    }
    try {
        const cachedVenue = await redis_1.redisClient.get(`venue_${venueId}`);
        if (cachedVenue) {
            logger_1.default.info(`Venue details fetched successfully from cache for ID ${venueId}`);
            return res.status(200).json({
                message: "Venue details fetched successfully from cache!",
                venue: JSON.parse(cachedVenue),
            });
        }
        const venue = await venue_1.VenueModel.findById(venueId);
        if (!venue) {
            logger_1.default.error(`Get venue by ID failed: Venue not found for ID ${venueId}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "VENUE_NOT_FOUND_ERROR"));
        }
        await redis_1.redisClient.set(`venue_${venueId}`, JSON.stringify(venue), {
            EX: 3600,
        });
        logger_1.default.info(`Venue details fetched successfully for ID ${venueId}`);
        return res.status(200).json({
            message: "Venue details fetched successfully!",
            venue,
        });
    }
    catch (error) {
        logger_1.default.error(`Get venue by ID failed: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.GetVenueById = GetVenueById;
const UpdateVenue = async (req, res) => {
    const venueId = req.params.id;
    const { name, location, capacity, description } = req.body;
    if (!venueId) {
        logger_1.default.error("Update venue failed: Missing venue ID");
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "MISSING_ID_ERROR"));
    }
    try {
        const updatedVenue = await venue_1.VenueModel.findByIdAndUpdate(venueId, { name, location, capacity, description }, { new: true });
        if (!updatedVenue) {
            logger_1.default.error(`Update venue failed: Venue not found for ID ${venueId}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "VENUE_NOT_FOUND_ERROR"));
        }
        await redis_1.redisClient.del(`venue_${venueId}`);
        await redis_1.redisClient.del("venues");
        logger_1.default.info(`Venue updated successfully for ID ${venueId}`);
        return res.status(200).json({
            message: "Venue updated successfully!",
            venue: updatedVenue,
        });
    }
    catch (error) {
        logger_1.default.error(`Update venue failed: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.UpdateVenue = UpdateVenue;
const DeleteVenue = async (req, res) => {
    const venueId = req.params.id;
    if (!venueId) {
        logger_1.default.error("Delete venue failed: Missing venue ID");
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "MISSING_ID_ERROR"));
    }
    try {
        const deletedVenue = await venue_1.VenueModel.findByIdAndDelete(venueId);
        if (!deletedVenue) {
            logger_1.default.error(`Delete venue failed: Venue not found for ID ${venueId}`);
            return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "VENUE_NOT_FOUND_ERROR"));
        }
        await redis_1.redisClient.del(`venue_${venueId}`);
        await redis_1.redisClient.del("venues");
        logger_1.default.info(`Venue deleted successfully for ID ${venueId}`);
        return res.status(200).json({
            message: "Venue deleted successfully!",
            venue: deletedVenue,
        });
    }
    catch (error) {
        logger_1.default.error(`Delete venue failed: ${error.message}`);
        return new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"));
    }
};
exports.DeleteVenue = DeleteVenue;
//# sourceMappingURL=venue.js.map