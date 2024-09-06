import mongoose from "mongoose"
import { IUser } from "../types/index"

const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
    },
})

export const UserModel = mongoose.model<IUser>("users", UserSchema)
