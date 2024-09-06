"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateStrongPassword = void 0;
function ValidateStrongPassword(password) {
    var strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return strongPasswordRegex.test(password);
}
exports.ValidateStrongPassword = ValidateStrongPassword;
//# sourceMappingURL=StrongPassword.js.map