"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var dotenv_1 = require("dotenv");
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var index_1 = require("./routes/index");
var redis_1 = require("./libraries/redis");
(0, dotenv_1.config)();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 8080;
var MONGO_URL = process.env.MONGO_URL;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", index_1.router);
app.get("/", function (req, res) {
    res.send("hi");
});
var server = http_1.default.createServer(app);
server.listen(PORT, function () {
    console.log("Server is running on ".concat(PORT));
});
(0, redis_1.ConnectToRedis)();
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(MONGO_URL, {
    dbName: "Auth_Reservation",
});
mongoose_1.default.connection.on("error", function (error) {
    console.log("MongoDB connection error:", error);
});
mongoose_1.default.connection.on("connected", function () {
    console.log("Connected to MongoDB");
});
mongoose_1.default.connection.on("disconnected", function () {
    console.log("Disconnected from MongoDB");
});
//# sourceMappingURL=index.js.map