import express from "express"
import http from "http"
import { config } from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import { router } from "./routes/index"
import { ConnectToRedis } from "./libraries/redis"
import { Request, Response } from "express"

config()

export const app = express()
const PORT = process.env.PORT || 8080
const MONGO_URL = process.env.MONGO_URL

app.use(cors())
app.use(express.json())

app.use("/api", router)
app.get("/", (req: Request, res: Response) => {
    res.send("hi")
})

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

ConnectToRedis()

mongoose.Promise = Promise
mongoose.connect(MONGO_URL, {
    dbName: "Auth_Reservation",
})

mongoose.connection.on("error", (error: Error) => {
    console.log("MongoDB connection error:", error)
})

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")
})

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB")
})
