import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

const SECRET_KEY = process.env.JWT_SECRET_KEY

export const GenerateToken = (userId: string, role: string): string => {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: "1d" })
}

export const VerifyToken = (token: string): jwt.JwtPayload => {
    try {
        return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload
    } catch (err) {
        throw err
    }
}
