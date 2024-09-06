import mongoose from "mongoose"
import { IVenue } from "../types/index"

const VenueSchema = new mongoose.Schema<IVenue>({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    capacity: {
        type: Number,
    },
    description: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
})

export const VenueModel = mongoose.model<IVenue>("venues", VenueSchema)
