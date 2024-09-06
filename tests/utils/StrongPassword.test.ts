import { ValidateStrongPassword } from "../../src/utils/StrongPassword"

describe("ValidateStrongPassword", () => {
    it("should return true for strong passwords", () => {
        const strongPasswords = [
            "Password1",
            "Str0ngPass",
            "SecurePass9",
            "1234abcdEF",
            "Valid1Password",
        ]

        strongPasswords.forEach((password) => {
            expect(ValidateStrongPassword(password)).toBe(true)
        })
    })

    it("should return false for weak passwords", () => {
        const weakPasswords = [
            "short",
            "password",
            "12345678",
            "abcdefgh",
            "Pass1",
            "P@ssword",
            "abc123",
            "abcdfg1",
        ]

        weakPasswords.forEach((password) => {
            expect(ValidateStrongPassword(password)).toBe(false)
        })
    })
})
