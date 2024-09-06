import { APIError } from "../errors/APIError"
import { ErrorManager as errorHandler } from "../helpers/managers/ErrorManager"
import { Response } from "express"

export const ValidateField = (key: string, value: string, res: Response) => {
    if (!value) {
        switch (key) {
            case "USERNAME":
                return new errorHandler(res).handleError(
                    new APIError(
                        "system",
                        "authentication",
                        `MISSING_USERNAME_ERROR`
                    )
                )
            case "EMAIL":
                return new errorHandler(res).handleError(
                    new APIError(
                        "system",
                        "authentication",
                        `MISSING_EMAIL_ERROR`
                    )
                )
            case "PASSWORD":
                return new errorHandler(res).handleError(
                    new APIError(
                        "system",
                        "authentication",
                        `MISSING_PASSWORD_ERROR`
                    )
                )
        }
    }
}
