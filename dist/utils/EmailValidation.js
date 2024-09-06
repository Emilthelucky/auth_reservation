"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEamil = void 0;
const ValidateEamil = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.ValidateEamil = ValidateEamil;
//# sourceMappingURL=EmailValidation.js.map