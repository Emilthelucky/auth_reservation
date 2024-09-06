import { Router } from "express"
import {
    CreateReservation,
    GetUserReservations,
    GetReservationDetails,
    DeleteReservation,
} from "../controllers/reservations"
import { isAuth } from "../middlewares/isAuth"

export const ReservationRoute = Router()

ReservationRoute.post("/", isAuth, CreateReservation)
ReservationRoute.get("/", isAuth, GetUserReservations)
ReservationRoute.get("/:id", isAuth, GetReservationDetails)
ReservationRoute.delete("/:id", isAuth, DeleteReservation)
