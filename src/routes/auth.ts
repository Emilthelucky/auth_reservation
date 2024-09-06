import { register, login, GetAllUsers } from "../controllers/user"
import { Router } from "express"
import { isAuth } from "../middlewares/isAuth"

export const AuthRoute = Router()

AuthRoute.post("/register", register)
AuthRoute.post("/login", login)
AuthRoute.get("/users", isAuth, GetAllUsers)
