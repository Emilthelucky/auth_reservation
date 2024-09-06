import { Router } from "express"
import { AuthRoute } from "./auth"
import { VenueRoute } from "./venue"
import { ReservationRoute } from "./reservation"

export const router = Router()

router.use("/auth", AuthRoute)
router.use("/venues", VenueRoute)
router.use("/reservations", ReservationRoute)
