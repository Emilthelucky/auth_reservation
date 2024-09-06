import mongoose from "mongoose"
import { IReservation } from "../types/index"

const ReservationSchema = new mongoose.Schema<IReservation>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "venues",
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    numberOfPeople: {
        type: Number,
    },
})

export const ReservationModel = mongoose.model<IReservation>(
    "reservations",
    ReservationSchema
)
