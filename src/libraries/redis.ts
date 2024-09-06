import { createClient } from "redis"
import { config } from "dotenv"
config()

const REDIS_HOST = process.env.REDIS_HOST
const REDIS_USERNAME = process.env.REDIS_USER
const REDIS_PASSWORD = process.env.REDIS_PASSWORD

export const redisClient = createClient({
    socket: {
        host: REDIS_HOST,
        port: 11492,
    },
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
})

export const ConnectToRedis = async () => {
    try {
        await redisClient.connect()
        console.log("Connected to Redis")
    } catch (error) {
        console.error("Failed to connect to Redis:", error)
    }
}
