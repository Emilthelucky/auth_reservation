import { ValidateEamil } from "../../src/utils/EmailValidation"
describe("ValidateEamil", () => {
    it("should return true for valid email addresses", () => {
        const validEmails = [
            "test@example.com",
            "user.name@domain.co",
            "user+name@sub.domain.com",
            "user_name@domain.co.uk",
            "user.name123@domain.org",
        ]

        validEmails.forEach((email) => {
            expect(ValidateEamil(email)).toBe(true)
        })
    })

    it("should return false for invalid email addresses", () => {
        const invalidEmails = [
            "plainaddress",
            "@missingusername.com",
            "username@.com",
            "username@domain.",
            "username@domain..com",
            "user@domain.c",
            "user@domain.c@com",
            "user@domain.com@",
            "user@domain.c@com",
        ]

        invalidEmails.forEach((email) => {
            expect(ValidateEamil(email)).toBe(false)
        })
    })
})
