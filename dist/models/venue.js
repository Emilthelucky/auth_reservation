"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenueModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var VenueSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    capacity: {
        type: Number,
    },
    description: {
        type: String,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
});
exports.VenueModel = mongoose_1.default.model("venues", VenueSchema);
//# sourceMappingURL=venue.js.map