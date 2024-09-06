import { Request, Response, NextFunction } from "express"
import { AuthenticatedRequest } from "../types/index"
import { APIError } from "../errors/APIError"
import { ErrorManager as errorHandler } from "../helpers/managers/ErrorManager"

export const isAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userRole = req.user?.role

    if (userRole !== "admin") {
        return new errorHandler(res).handleError(
            new APIError("system", "authorization", "FORBIDDEN_ERROR")
        )
    }

    next()
}
