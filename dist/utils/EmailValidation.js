"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEamil = void 0;
var ValidateEamil = function (email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.ValidateEamil = ValidateEamil;
//# sourceMappingURL=EmailValidation.js.map