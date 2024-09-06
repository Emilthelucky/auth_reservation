import { ValidateField } from "../../src/utils/ValidateFields"
import { APIError } from "../../src/errors/APIError"
import { ErrorManager } from "../../src/helpers/managers/ErrorManager"
import { Response } from "express"

jest.mock("../../src/helpers/managers/ErrorManager")

describe("ValidateField", () => {
    let res: Partial<Response>

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        jest.clearAllMocks()
    })

    it("should handle missing USERNAME error", () => {
        ValidateField("USERNAME", "", res as Response)

        expect(ErrorManager.prototype.handleError).toHaveBeenCalledWith(
            expect.any(APIError)
        )

        const errorInstance = (ErrorManager.prototype.handleError as jest.Mock)
            .mock.calls[0][0]
        expect(errorInstance).toEqual(
            new APIError("system", "authentication", "MISSING_USERNAME_ERROR")
        )
    })

    it("should handle missing EMAIL error", () => {
        ValidateField("EMAIL", "", res as Response)

        expect(ErrorManager.prototype.handleError).toHaveBeenCalledWith(
            expect.any(APIError)
        )

        const errorInstance = (ErrorManager.prototype.handleError as jest.Mock)
            .mock.calls[0][0]
        expect(errorInstance).toEqual(
            new APIError("system", "authentication", "MISSING_EMAIL_ERROR")
        )
    })

    it("should handle missing PASSWORD error", () => {
        ValidateField("PASSWORD", "", res as Response)

        expect(ErrorManager.prototype.handleError).toHaveBeenCalledWith(
            expect.any(APIError)
        )

        const errorInstance = (ErrorManager.prototype.handleError as jest.Mock)
            .mock.calls[0][0]
        expect(errorInstance).toEqual(
            new APIError("system", "authentication", "MISSING_PASSWORD_ERROR")
        )
    })

    it("should not call handleError if value is provided", () => {
        ValidateField("USERNAME", "valid_username", res as Response)

        expect(ErrorManager.prototype.handleError).not.toHaveBeenCalled()
    })
})
