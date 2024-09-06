import { APIError } from "../../errors/APIError"
import { Response } from "express"
import { APIErrors, APIError as ErrorType } from "../../types/errorTypes"

export class ErrorManager {
    errorList: APIError<any, any, any>[] = []
    res: Response

    constructor(res: Response) {
        this.res = res
    }

    addError<
        T extends keyof APIErrors,
        U extends keyof APIErrors[T],
        V extends keyof APIErrors[T][U]
    >(error: APIError<T, U, V>) {
        this.errorList.push(error)
    }

    getErrors() {
        return this.errorList
    }

    handleError<
        T extends keyof APIErrors,
        U extends keyof APIErrors[T],
        V extends keyof APIErrors[T][U]
    >(error: APIError<T, U, V>) {
        if (this.res.headersSent) {
            return
        }

        const { statusCode, message, errorType } = error

        const payload: ErrorType = { statusCode, message }

        return this.res.status(statusCode).json({ [errorType]: payload })
    }
}
