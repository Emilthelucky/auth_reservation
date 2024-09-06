import bcrypt from "bcryptjs"

export const HashPassword = async (enteredPassword: string) => {
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(enteredPassword, salt)
    return hashedPassword
}

export const ComparePassword = async (
    enteredPassword: string,
    realPassword: string
) => {
    const check = await bcrypt.compare(enteredPassword, realPassword)
    return check
}
