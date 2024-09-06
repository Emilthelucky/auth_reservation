"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = void 0;
const errorCodes_json_1 = __importDefault(require("../configurations/errorCodes.json"));
class APIError extends Error {
    statusCode;
    message;
    field;
    section;
    errorType;
    constructor(section, field, errorType) {
        const errorDetails = errorCodes_json_1.default[section][field][errorType];
        super(errorDetails.message);
        this.statusCode = errorDetails.statusCode;
        this.field = field.toString();
        this.section = section;
        this.errorType = errorType.toString();
    }
}
exports.APIError = APIError;
//# sourceMappingURL=APIError.js.map