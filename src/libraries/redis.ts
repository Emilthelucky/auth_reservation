// import { createClient } from "redis"
// import { config } from "dotenv"
// config()

// const REDIS_HOST = process.env.REDIS_HOST
// const REDIS_USERNAME = process.env.REDIS_USERNAME
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD

// export const redisClient = createClient({
//     socket: {
//         host: REDIS_HOST,
//         port: 11492,
//     },
//     username: REDIS_USERNAME,
//     password: REDIS_PASSWORD,
// })

// const redisClient = createClient({
//     password: "g1C33wYuhAhTS5T7aTbeFpExOBvptwLx",
//     socket: {
//         host: "redis-11492.c267.us-east-1-4.ec2.redns.redis-cloud.com",
//         port: 11492,
//     },
// })

// export const ConnectToRedis = async () => {
//     try {
//         await redisClient.connect()
//         console.log("Connected to Redis")
//     } catch (error) {
//         console.error("Failed to connect to Redis:", error)
//     }
// }
