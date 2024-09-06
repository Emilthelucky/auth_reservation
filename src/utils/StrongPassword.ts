export function ValidateStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return strongPasswordRegex.test(password)
}
