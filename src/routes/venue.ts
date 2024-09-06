import {
    CreateVenue,
    GetVenues,
    GetVenueById,
    UpdateVenue,
    DeleteVenue,
} from "../controllers/venue"
import { Router } from "express"
import { isAuth } from "../middlewares/isAuth"
import { isAdmin } from "../middlewares/isAdmin"

export const VenueRoute = Router()

VenueRoute.post("/", isAuth, isAdmin, CreateVenue)
VenueRoute.get("/", isAuth, GetVenues)
VenueRoute.get("/:id", isAuth, GetVenueById)
VenueRoute.put("/:id", isAuth, isAdmin, UpdateVenue)
VenueRoute.delete("/:id", isAuth, isAdmin, DeleteVenue)
