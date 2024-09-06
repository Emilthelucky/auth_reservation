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
exports.DeleteVenue = exports.UpdateVenue = exports.GetVenueById = exports.GetVenues = exports.CreateVenue = void 0;
var venue_1 = require("../models/venue");
var APIError_1 = require("../errors/APIError");
var ErrorManager_1 = require("../helpers/managers/ErrorManager");
var redis_1 = require("../libraries/redis");
var logger_1 = __importDefault(require("../libraries/logger"));
var CreateVenue = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, location, capacity, description, newVenue, error_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, name = _a.name, location = _a.location, capacity = _a.capacity, description = _a.description;
                if (!name || !location || !capacity || !description) {
                    logger_1.default.error("Create venue failed: Missing fields");
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "MISSING_FIELDS_ERROR"))];
                }
                logger_1.default.info("Creating venue by user ".concat((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId));
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                return [4 /*yield*/, venue_1.VenueModel.create({
                        name: name,
                        location: location,
                        capacity: capacity,
                        description: description,
                        createdBy: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId,
                    })];
            case 2:
                newVenue = _d.sent();
                return [4 /*yield*/, redis_1.redisClient.del("venues")];
            case 3:
                _d.sent();
                logger_1.default.info("Venue created successfully: ".concat(newVenue._id));
                return [2 /*return*/, res.status(201).json({
                        message: "Venue created successfully!",
                        venue: newVenue,
                    })];
            case 4:
                error_1 = _d.sent();
                logger_1.default.error("Create venue failed: ".concat(error_1.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.CreateVenue = CreateVenue;
var GetVenues = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, location, pageNumber, pageSize, skip, filters, cachedVenues, _d, venues, total, error_2;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, location = _a.location;
                pageNumber = parseInt(page, 10);
                pageSize = parseInt(limit, 10);
                skip = (pageNumber - 1) * pageSize;
                filters = {};
                if (location && location !== "") {
                    filters.location = location;
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 5, , 6]);
                return [4 /*yield*/, redis_1.redisClient.get("venues")];
            case 2:
                cachedVenues = _e.sent();
                if (cachedVenues) {
                    logger_1.default.info("Venues fetched successfully from cache");
                    return [2 /*return*/, res.status(200).json({
                            message: "Venues fetched successfully from cache!",
                            venues: JSON.parse(cachedVenues),
                        })];
                }
                return [4 /*yield*/, Promise.all([
                        venue_1.VenueModel.find(filters).skip(skip).limit(pageSize),
                        venue_1.VenueModel.countDocuments(filters),
                    ])];
            case 3:
                _d = _e.sent(), venues = _d[0], total = _d[1];
                return [4 /*yield*/, redis_1.redisClient.set("venues", JSON.stringify(venues), { EX: 3600 })];
            case 4:
                _e.sent();
                logger_1.default.info("Venues fetched successfully from database");
                return [2 /*return*/, res.status(200).json({
                        message: "Venues fetched successfully!",
                        total: total,
                        page: pageNumber,
                        limit: pageSize,
                        venues: venues,
                    })];
            case 5:
                error_2 = _e.sent();
                logger_1.default.error("Get venues failed: ".concat(error_2.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.GetVenues = GetVenues;
var GetVenueById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var venueId, cachedVenue, venue, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                venueId = req.params.id;
                if (!venueId) {
                    logger_1.default.error("Get venue by ID failed: Missing venue ID");
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "MISSING_ID_ERROR"))];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, redis_1.redisClient.get("venue_".concat(venueId))];
            case 2:
                cachedVenue = _a.sent();
                if (cachedVenue) {
                    logger_1.default.info("Venue details fetched successfully from cache for ID ".concat(venueId));
                    return [2 /*return*/, res.status(200).json({
                            message: "Venue details fetched successfully from cache!",
                            venue: JSON.parse(cachedVenue),
                        })];
                }
                return [4 /*yield*/, venue_1.VenueModel.findById(venueId)];
            case 3:
                venue = _a.sent();
                if (!venue) {
                    logger_1.default.error("Get venue by ID failed: Venue not found for ID ".concat(venueId));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "VENUE_NOT_FOUND_ERROR"))];
                }
                return [4 /*yield*/, redis_1.redisClient.set("venue_".concat(venueId), JSON.stringify(venue), {
                        EX: 3600,
                    })];
            case 4:
                _a.sent();
                logger_1.default.info("Venue details fetched successfully for ID ".concat(venueId));
                return [2 /*return*/, res.status(200).json({
                        message: "Venue details fetched successfully!",
                        venue: venue,
                    })];
            case 5:
                error_3 = _a.sent();
                logger_1.default.error("Get venue by ID failed: ".concat(error_3.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.GetVenueById = GetVenueById;
var UpdateVenue = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var venueId, _a, name, location, capacity, description, updatedVenue, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                venueId = req.params.id;
                _a = req.body, name = _a.name, location = _a.location, capacity = _a.capacity, description = _a.description;
                if (!venueId) {
                    logger_1.default.error("Update venue failed: Missing venue ID");
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "MISSING_ID_ERROR"))];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, venue_1.VenueModel.findByIdAndUpdate(venueId, { name: name, location: location, capacity: capacity, description: description }, { new: true })];
            case 2:
                updatedVenue = _b.sent();
                if (!updatedVenue) {
                    logger_1.default.error("Update venue failed: Venue not found for ID ".concat(venueId));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "VENUE_NOT_FOUND_ERROR"))];
                }
                return [4 /*yield*/, redis_1.redisClient.del("venue_".concat(venueId))];
            case 3:
                _b.sent();
                return [4 /*yield*/, redis_1.redisClient.del("venues")];
            case 4:
                _b.sent();
                logger_1.default.info("Venue updated successfully for ID ".concat(venueId));
                return [2 /*return*/, res.status(200).json({
                        message: "Venue updated successfully!",
                        venue: updatedVenue,
                    })];
            case 5:
                error_4 = _b.sent();
                logger_1.default.error("Update venue failed: ".concat(error_4.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.UpdateVenue = UpdateVenue;
var DeleteVenue = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var venueId, deletedVenue, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                venueId = req.params.id;
                if (!venueId) {
                    logger_1.default.error("Delete venue failed: Missing venue ID");
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "MISSING_ID_ERROR"))];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, venue_1.VenueModel.findByIdAndDelete(venueId)];
            case 2:
                deletedVenue = _a.sent();
                if (!deletedVenue) {
                    logger_1.default.error("Delete venue failed: Venue not found for ID ".concat(venueId));
                    return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "venue", "VENUE_NOT_FOUND_ERROR"))];
                }
                return [4 /*yield*/, redis_1.redisClient.del("venue_".concat(venueId))];
            case 3:
                _a.sent();
                return [4 /*yield*/, redis_1.redisClient.del("venues")];
            case 4:
                _a.sent();
                logger_1.default.info("Venue deleted successfully for ID ".concat(venueId));
                return [2 /*return*/, res.status(200).json({
                        message: "Venue deleted successfully!",
                        venue: deletedVenue,
                    })];
            case 5:
                error_5 = _a.sent();
                logger_1.default.error("Delete venue failed: ".concat(error_5.message));
                return [2 /*return*/, new ErrorManager_1.ErrorManager(res).handleError(new APIError_1.APIError("system", "server", "INERTIAL_SERVER_ERROR"))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.DeleteVenue = DeleteVenue;
//# sourceMappingURL=venue.js.map