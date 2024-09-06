"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectToRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_USERNAME = process.env.REDIS_USER;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
exports.redisClient = (0, redis_1.createClient)({
    socket: {
        host: REDIS_HOST,
        port: 11492,
    },
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
});
const ConnectToRedis = async () => {
    try {
        await exports.redisClient.connect();
        console.log("Connected to Redis");
    }
    catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
};
exports.ConnectToRedis = ConnectToRedis;
//# sourceMappingURL=redis.js.map