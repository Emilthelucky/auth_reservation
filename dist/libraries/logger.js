"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf, colorize = winston_1.format.colorize, padLevels = winston_1.format.padLevels, prettyPrint = winston_1.format.prettyPrint, errors = winston_1.format.errors;
var options = {
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
var dateString = new Date(Date.now()).toLocaleDateString().replace(/\//g, "-");
var logger = (0, winston_1.createLogger)({
    levels: options.levels,
    format: combine(errors({ stack: true }), timestamp({ format: "DD-MM-YYYY (HH:mm)" }), prettyPrint(), colorize(), padLevels({ levels: options.levels }), printf(function (msg) { return "[".concat(msg.timestamp, "] ").concat(msg.level, ": ").concat(msg.message.trim()); })),
    transports: [
        new winston_1.transports.Console({ level: "console" }),
        new winston_1.transports.File({
            filename: "./src/helpers/logs/info/".concat(dateString, "-info.log"),
            level: "info",
        }),
        new winston_1.transports.File({
            filename: "./src/helpers/logs/warn/".concat(dateString, "-warn.log"),
            level: "warn",
        }),
        new winston_1.transports.File({
            filename: "./src/helpers/logs/error/".concat(dateString, "-error.log"),
            level: "error",
        }),
        new winston_1.transports.File({
            filename: "./src/helpers/logs/database/".concat(dateString, "-database.log"),
            level: "database",
        }),
        new winston_1.transports.File({
            filename: "./src/helpers/logs/console/".concat(dateString, "-console.log"),
            level: "console",
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
//# sourceMappingURL=logger.js.map