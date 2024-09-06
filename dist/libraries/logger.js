"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize, padLevels, prettyPrint, errors } = winston_1.format;
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
};
(0, winston_1.addColors)(options.colors);
const dateString = new Date(Date.now()).toLocaleDateString().replace(/\//g, "-");
const logger = (0, winston_1.createLogger)({
    levels: options.levels,
    format: combine(errors({ stack: true }), timestamp({ format: "DD-MM-YYYY (HH:mm)" }), prettyPrint(), colorize(), padLevels({ levels: options.levels }), printf((msg) => `[${msg.timestamp}] ${msg.level}: ${msg.message.trim()}`)),
    transports: [
        new winston_1.transports.Console({ level: "console" }),
        new winston_1.transports.File({
            filename: `./src/helpers/logs/info/${dateString}-info.log`,
            level: "info",
        }),
        new winston_1.transports.File({
            filename: `./src/helpers/logs/warn/${dateString}-warn.log`,
            level: "warn",
        }),
        new winston_1.transports.File({
            filename: `./src/helpers/logs/error/${dateString}-error.log`,
            level: "error",
        }),
        new winston_1.transports.File({
            filename: `./src/helpers/logs/database/${dateString}-database.log`,
            level: "database",
        }),
        new winston_1.transports.File({
            filename: `./src/helpers/logs/console/${dateString}-console.log`,
            level: "console",
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
//# sourceMappingURL=logger.js.map