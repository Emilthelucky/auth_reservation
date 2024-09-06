import { Request, Response } from "express"
import { ValidateField } from "../utils/ValidateFields"
import { UserModel } from "../models/user"
import { APIError } from "../errors/APIError"
import { ErrorManager as errorHandler } from "../helpers/managers/ErrorManager"
import { HashPassword, ComparePassword } from "../libraries/bcrypt"
import { ValidateEamil } from "../utils/EmailValidation"
import { ValidateStrongPassword } from "../utils/StrongPassword"
import { GenerateToken } from "../libraries/jwt"
import logger from "../libraries/logger"

export const register = async (req: Request, res: Response) => {
    logger.info(`Register attempt: ${JSON.stringify(req.body)}`)
    const { username, email, password, role } = req.body

    ValidateField("USERNAME", username, res)
    ValidateField("EMAIL", email, res)
    ValidateField("PASSWORD", password, res)

    if (!ValidateEamil(email)) {
        logger.error(`Registration failed: Invalid email ${email}`)
        return new errorHandler(res).handleError(
            new APIError("system", "authentication", "INVALID_EMAIL_ERROR")
        )
    }

    if (!ValidateStrongPassword(password)) {
        logger.error(`Registration failed: Weak password for email ${email}`)
        return new errorHandler(res).handleError(
            new APIError(
                "system",
                "authentication",
                "NOT_STRONG_PASSWORD_ERROR"
            )
        )
    }

    const validRoles = ["user", "admin"]
    if (role && !validRoles.includes(role)) {
        logger.error(`Registration failed: Invalid role ${role}`)
        return new errorHandler(res).handleError(
            new APIError("system", "authentication", "INVALID_ROLE_ERROR")
        )
    }

    const existingUser = await UserModel.findOne({
        $or: [{ email }, { username }],
    })

    if (existingUser) {
        if (existingUser.email === email) {
            logger.error(`Registration failed: Email already exists ${email}`)
            return new errorHandler(res).handleError(
                new APIError("system", "authentication", "EMAIL_FOUND_ERROR")
            )
        }
        if (existingUser.username === username) {
            logger.error(
                `Registration failed: Username already exists ${username}`
            )
            return new errorHandler(res).handleError(
                new APIError("system", "authentication", "USERNAME_FOUND_ERROR")
            )
        }
    }

    const userRole = role && validRoles.includes(role) ? role : "user"

    const hashedP = await HashPassword(password)
    const newUser = await UserModel.create({
        username,
        email,
        password: hashedP,
        role: userRole,
    })

    logger.info(`User registered successfully: ${username}`)
    return res.status(200).json({
        message: "User Registered Successfully!",
    })
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        logger.error(`Login failed: Missing fields for email ${email}`)
        return new errorHandler(res).handleError(
            new APIError("system", "authentication", "MISSING_FIELDS_ERROR")
        )
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
        logger.error(`Login failed: User not found for email ${email}`)
        return new errorHandler(res).handleError(
            new APIError("system", "authentication", "USER_NOT_FOUND_ERROR")
        )
    }

    const isPasswordValid = await ComparePassword(password, user.password)

    if (!isPasswordValid) {
        logger.error(`Login failed: Incorrect password for email ${email}`)
        return new errorHandler(res).handleError(
            new APIError("system", "authentication", "INCORRECT_PASSWORD_ERROR")
        )
    }

    const accessToken = GenerateToken(user._id, user.role)

    logger.info(`User logged in successfully: ${user.username}`)
    return res.status(200).json({
        message: "User has successfully logged in!",
        accessToken,
    })
}

export const GetAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({})
        logger.info(`Fetched all users: ${users.length} users found`)
        return res.status(200).json(users)
    } catch (error) {
        logger.error(`Failed to fetch users: ${error.message}`)
        return new errorHandler(res).handleError(
            new APIError("system", "server", "DATABASE_ERROR")
        )
    }
}
