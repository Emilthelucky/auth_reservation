"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenueRoute = void 0;
var venue_1 = require("../controllers/venue");
var express_1 = require("express");
var isAuth_1 = require("../middlewares/isAuth");
var isAdmin_1 = require("../middlewares/isAdmin");
exports.VenueRoute = (0, express_1.Router)();
exports.VenueRoute.post("/", isAuth_1.isAuth, isAdmin_1.isAdmin, venue_1.CreateVenue);
exports.VenueRoute.get("/", isAuth_1.isAuth, venue_1.GetVenues);
exports.VenueRoute.get("/:id", isAuth_1.isAuth, venue_1.GetVenueById);
exports.VenueRoute.put("/:id", isAuth_1.isAuth, isAdmin_1.isAdmin, venue_1.UpdateVenue);
exports.VenueRoute.delete("/:id", isAuth_1.isAuth, isAdmin_1.isAdmin, venue_1.DeleteVenue);
//# sourceMappingURL=venue.js.map