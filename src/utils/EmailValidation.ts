export const ValidateEamil = (email: string): boolean => {
    const emailRegex = /^(?!.*\.\.)[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    return emailRegex.test(email)
}
