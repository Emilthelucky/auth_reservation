"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./routes/index");
const redis_1 = require("./libraries/redis");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", index_1.router);
app.get("/", (req, res) => {
    res.send("hi");
});
const server = http_1.default.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
(0, redis_1.ConnectToRedis)();
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(MONGO_URL, {
    dbName: "Auth_Reservation",
});
mongoose_1.default.connection.on("error", (error) => {
    console.log("MongoDB connection error:", error);
});
mongoose_1.default.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});
//# sourceMappingURL=index.js.map