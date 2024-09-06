"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateStrongPassword = ValidateStrongPassword;
function ValidateStrongPassword(password) {
    var strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return strongPasswordRegex.test(password);
}
//# sourceMappingURL=StrongPassword.js.map