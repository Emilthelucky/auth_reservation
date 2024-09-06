import { Response, NextFunction } from "express"
import { VerifyToken } from "../libraries/jwt"
import { AuthenticatedRequest, IUser } from "../types/index"
import { APIError } from "../errors/APIError"
import { ErrorManager as errorHandler } from "../helpers/managers/ErrorManager"
import jwt from "jsonwebtoken"

export const isAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new errorHandler(res).handleError(
            new APIError(
                "system",
                "authorization",
                "MISSING_AUTHORIZATION_ERROR"
            )
        )
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = VerifyToken(token) as IUser
        req.user = decoded
        next()
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return new errorHandler(res).handleError(
                new APIError(
                    "system",
                    "authorization",
                    "INVALID_AUTHORIZATION_ERROR"
                )
            )
        } else if (err instanceof jwt.JsonWebTokenError) {
            return new errorHandler(res).handleError(
                new APIError(
                    "system",
                    "authorization",
                    "EXPIRED_AUTHORIZATION_ERROR"
                )
            )
        } else {
            return new errorHandler(res).handleError(
                new APIError("system", "server", "INERTIAL_SERVER_ERROR")
            )
        }
    }
}
