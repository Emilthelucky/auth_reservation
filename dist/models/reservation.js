"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ReservationSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
    venueId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "venues",
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    numberOfPeople: {
        type: Number,
    },
});
exports.ReservationModel = mongoose_1.default.model("reservations", ReservationSchema);
//# sourceMappingURL=reservation.js.map