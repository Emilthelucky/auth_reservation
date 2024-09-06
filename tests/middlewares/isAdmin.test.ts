import request from "supertest"
import express from "express"
import { isAdmin } from "../../src/middlewares/isAdmin"

const app = express()
app.use(express.json())

app.get("/test", isAdmin, (req, res) => {
    res.status(200).send()
})

const mockAuthenticatedMiddleware =
    (role: "user" | "admin" | undefined) => (req: any, res: any, next: any) => {
        req.user = { role } as any
        next()
    }

const setupAppWithRole = (role: "user" | "admin") => {
    const testApp = express()
    testApp.use(express.json())
    testApp.use(mockAuthenticatedMiddleware(role))
    testApp.get("/test", isAdmin, (req, res) => {
        res.status(200).send()
    })
    return testApp
}

describe("isAdmin Middleware", () => {
    it("should allow access for admin users", async () => {
        const appWithAdmin = setupAppWithRole("admin")
        const response = await request(appWithAdmin)
            .get("/test")
            .set("Authorization", "Bearer validToken")

        expect(response.status).toBe(200)
    })

    it("should deny access for non-admin users", async () => {
        const appWithUser = setupAppWithRole("user")
        const response = await request(appWithUser)
            .get("/test")
            .set("Authorization", "Bearer validToken")

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            FORBIDDEN_ERROR: {
                message: "You do not have permission to access this resource!",
                statusCode: 401,
            },
        })
    })
})
