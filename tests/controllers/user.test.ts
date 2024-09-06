import { Request, Response } from "express"
import { register, login, GetAllUsers } from "../../src/controllers/user"
import { UserModel } from "../../src/models/user"
import { HashPassword, ComparePassword } from "../../src/libraries/bcrypt"
import { GenerateToken } from "../../src/libraries/jwt"

jest.mock("../../src/models/user", () => ({
    UserModel: {
        findOne: jest.fn(),
        create: jest.fn(),
        find: jest.fn(),
    },
}))
jest.mock("../../src/libraries/bcrypt")
jest.mock("../../src/libraries/jwt")

const mockSend = jest.fn()
const req = {} as Request
const res = {
    status: jest.fn(() => ({
        json: mockSend,
    })),
} as unknown as Response

describe("User Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    // describe("register", () => {
    //     it("should register a user successfully", async () => {
    //         req.body = {
    //             username: "testuser",
    //             email: "test@example.com",
    //             password: "StrongPassword123!",
    //             role: "user",
    //         }
    //         ;(UserModel.findOne as jest.Mock).mockResolvedValue(null)
    //         ;(HashPassword as jest.Mock).mockResolvedValue("hashedPassword")
    //         ;(UserModel.create as jest.Mock).mockResolvedValue(req.body)

    //         await register(req, res)

    //         expect(UserModel.findOne).toHaveBeenCalledWith({
    //             $or: [{ email: "test@example.com" }, { username: "testuser" }],
    //         })
    //         expect(HashPassword).toHaveBeenCalledWith("StrongPassword123!")
    //         expect(UserModel.create).toHaveBeenCalledWith({
    //             username: "testuser",
    //             email: "test@example.com",
    //             password: "hashedPassword",
    //             role: "user",
    //         })
    //         expect(res.status).toHaveBeenCalledWith(201)
    //         expect(mockSend).toHaveBeenCalledWith({
    //             message: "User Registered Successfully!",
    //         })
    //     })

    //     it("should return error for invalid email", async () => {
    //         req.body = {
    //             username: "testuser",
    //             email: "invalid-email",
    //             password: "StrongPassword123!",
    //             role: "user",
    //         }

    //         await register(req, res)

    //         expect(res.status).toHaveBeenCalledWith(400)
    //         expect(mockSend).toHaveBeenCalledWith({
    //             INVALID_EMAIL_ERROR: {
    //                 message: "Invalid email format!",
    //                 statusCode: 400,
    //             },
    //         })
    //     })

    //     it("should return error for missing fields", async () => {
    //         req.body = {
    //             email: "test@example.com",
    //         }

    //         await register(req, res)

    //         expect(res.status).toHaveBeenCalledWith(400)
    //         expect(mockSend).toHaveBeenCalledWith({
    //             MISSING_USERNAME_ERROR: {
    //                 message: "Username is required!",
    //                 statusCode: 400,
    //             },
    //         })
    //         expect(mockSend).toHaveBeenCalledWith({
    //             MISSING_PASSWORD_ERROR: {
    //                 message: "Password is required!",
    //                 statusCode: 400,
    //             },
    //         })
    //     })
    // })

    describe("login", () => {
        it("should log in a user successfully", async () => {
            req.body = {
                email: "test@example.com",
                password: "StrongPassword123!",
            }
            ;(UserModel.findOne as jest.Mock).mockResolvedValue({
                _id: "userId",
                password: "hashedPassword",
                role: "user",
                username: "testuser",
            })
            ;(ComparePassword as jest.Mock).mockResolvedValue(true)
            ;(GenerateToken as jest.Mock).mockReturnValue("accessToken")

            await login(req, res)

            expect(UserModel.findOne).toHaveBeenCalledWith({
                email: "test@example.com",
            })
            expect(ComparePassword).toHaveBeenCalledWith(
                "StrongPassword123!",
                "hashedPassword"
            )
            expect(GenerateToken).toHaveBeenCalledWith("userId", "user")
            expect(res.status).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith({
                message: "User has successfully logged in!",
                accessToken: "accessToken",
            })
        })

        it("should return error for missing fields", async () => {
            req.body = {
                email: "test@example.com",
            }

            await login(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(mockSend).toHaveBeenCalledWith({
                MISSING_FIELDS_ERROR: {
                    message: "Please fill all the forms!",
                    statusCode: 400,
                },
            })
        })
    })

    describe("GetAllUsers", () => {
        it("should return all users successfully", async () => {
            const users = [{ username: "testuser1" }, { username: "testuser2" }]
            ;(UserModel.find as jest.Mock).mockResolvedValue(users)

            await GetAllUsers(req, res)

            expect(UserModel.find).toHaveBeenCalledWith({})
            expect(res.status).toHaveBeenCalledWith(200)
            expect(mockSend).toHaveBeenCalledWith(users)
        })

        it("should return error if database query fails", async () => {
            ;(UserModel.find as jest.Mock).mockRejectedValue(
                new Error("Database error")
            )

            await GetAllUsers(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(mockSend).toHaveBeenCalledWith({
                DATABASE_ERROR: {
                    message: "Unable to connect to the Database!",
                    statusCode: 500,
                },
            })
        })
    })
})
