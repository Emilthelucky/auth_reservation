import { APILogger } from "../types/index"
import { createLogger, addColors, format, transports } from "winston"
const { combine, timestamp, printf, colorize, padLevels, prettyPrint, errors } =
    format

const options = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        database: 3,
        console: 4,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue",
        database: "green",
        console: "blue",
    },
}

addColors(options.colors)

const dateString = new Date(Date.now()).toLocaleDateString().replace(/\//g, "-")

const logger: APILogger = createLogger({
    levels: options.levels,
    format: combine(
        errors({ stack: true }),
        timestamp({ format: "DD-MM-YYYY (HH:mm)" }),
        prettyPrint(),
        colorize(),
        padLevels({ levels: options.levels }),
        printf(
            (msg) => `[${msg.timestamp}] ${msg.level}: ${msg.message.trim()}`
        )
    ),
    transports: [
        new transports.Console({ level: "console" }),
        new transports.File({
            filename: `./src/helpers/logs/info/${dateString}-info.log`,
            level: "info",
        }),
        new transports.File({
            filename: `./src/helpers/logs/warn/${dateString}-warn.log`,
            level: "warn",
        }),
        new transports.File({
            filename: `./src/helpers/logs/error/${dateString}-error.log`,
            level: "error",
        }),
        new transports.File({
            filename: `./src/helpers/logs/database/${dateString}-database.log`,
            level: "database",
        }),
        new transports.File({
            filename: `./src/helpers/logs/console/${dateString}-console.log`,
            level: "console",
        }),
    ],
    exitOnError: false,
})

export default logger
