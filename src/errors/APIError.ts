import { APIErrors, APIError as ErrorType } from "../types/errorTypes"
import errorCodes from "../configurations/errorCodes.json"

export class APIError<
    T extends keyof APIErrors,
    U extends keyof APIErrors[T],
    V extends keyof APIErrors[T][U]
> extends Error {
    statusCode: number
    message: string
    field: string
    section: string
    errorType: string

    constructor(section: T, field: U, errorType: V) {
        const errorDetails = errorCodes[section][field][errorType] as ErrorType

        super(errorDetails.message)
        this.statusCode = errorDetails.statusCode
        this.field = field.toString()
        this.section = section
        this.errorType = errorType.toString()
    }
}
