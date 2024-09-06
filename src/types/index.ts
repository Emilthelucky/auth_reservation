import { Request } from "express"
import { Types } from "mongoose"
import { Logger } from "winston"

export interface IReservation {
    userId?: Types.ObjectId | string
    venueId?: Types.ObjectId
    date: Date
    time: string
    numberOfPeople: number
    _id?: string
}

export interface IVenue {
    name: string
    location: string
    capacity: number
    description: string
    createdBy: Types.ObjectId | string
}

export interface IUser {
    username: string
    email: string
    password: string
    role?: "user" | "admin"
    _id?: string
    userId?: string
}

export interface TokenPayload {
    username: string
    email: string
    password: string
    role?: "user" | "admin"
    userId?: string
    _id?: string
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | TokenPayload
}

export interface APILogger extends Logger {
    database?: (message: string) => void
    request?: (message: string) => void
}
