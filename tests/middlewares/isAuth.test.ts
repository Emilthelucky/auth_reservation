import request from "supertest"
import express from "express"
import { isAuth } from "../../src/middlewares/isAuth"
import jwt from "jsonwebtoken"

const app = express()
app.use(express.json())
app.use(isAuth)

jest.mock("../../src/libraries/jwt", () => ({
    VerifyToken: jest.fn(),
}))

describe("isAuth Middleware", () => {
    it("should return 401 if authorization header is missing Bearer prefix", async () => {
        const response = await request(app)
            .get("/test")
            .set("Authorization", "BearerInvalidToken")

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            MISSING_AUTHORIZATION_ERROR: {
                message: "Authorization header is missing!",
                statusCode: 401,
            },
        })
    })

    it("should return 401 if token is invalid", async () => {
        ;(
            require("../../src/libraries/jwt").VerifyToken as jest.Mock
        ).mockImplementation(() => {
            throw new jwt.JsonWebTokenError("Invalid token")
        })

        const response = await request(app)
            .get("/test")
            .set("Authorization", "Bearer InvalidToken")

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            EXPIRED_AUTHORIZATION_ERROR: {
                message: "Authorization token has expired!",
                statusCode: 401,
            },
        })
    })

    it("should return 401 if token is expired", async () => {
        ;(
            require("../../src/libraries/jwt").VerifyToken as jest.Mock
        ).mockImplementation(() => {
            throw new jwt.TokenExpiredError("Token expired", new Date())
        })

        const response = await request(app)
            .get("/test")
            .set("Authorization", "Bearer ExpiredToken")

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            INVALID_AUTHORIZATION_ERROR: {
                message: "Invalid authorization token!",
                statusCode: 401,
            },
        })
    })
})
