import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { UserModel } from "../../src/models/user"

jest.setTimeout(30000)

describe("UserModel", () => {
    let mongoServer: MongoMemoryServer

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions)
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    afterEach(async () => {
        // Her testten sonra koleksiyonu temizle
        await UserModel.deleteMany({})
    })

    it("should create and save a user successfully", async () => {
        const userData = {
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
            role: "user",
        }

        const newUser = new UserModel(userData)
        const savedUser = await newUser.save()

        expect(savedUser._id).toBeDefined()
        expect(savedUser.username).toBe(userData.username)
        expect(savedUser.email).toBe(userData.email)
        expect(savedUser.password).toBe(userData.password)
        expect(savedUser.role).toBe(userData.role)
    })

    it("should not save a user with a role not defined in the enum", async () => {
        const userData = {
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
            role: "invalidRole",
        }

        const newUser = new UserModel(userData)
        let error

        try {
            await newUser.save()
        } catch (err) {
            error = err
        }

        expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(error.errors.role).toBeDefined()
    })

    it("should find a user by username", async () => {
        const userData = {
            username: "findme",
            email: "findme@example.com",
            password: "password123",
            role: "user",
        }

        await UserModel.create(userData)
        const foundUser = await UserModel.findOne({ username: "findme" })

        expect(foundUser).not.toBeNull()
        expect(foundUser?.email).toBe(userData.email)
    })

    it("should update a user's role", async () => {
        const userData = {
            username: "updateme",
            email: "updateme@example.com",
            password: "password123",
            role: "user",
        }

        const user = await UserModel.create(userData)
        user.role = "admin"
        const updatedUser = await user.save()

        expect(updatedUser.role).toBe("admin")
    })

    it("should delete a user", async () => {
        const userData = {
            username: "deleteme",
            email: "deleteme@example.com",
            password: "password123",
            role: "user",
        }

        const user = await UserModel.create(userData)
        await UserModel.deleteOne({ _id: user._id })

        const deletedUser = await UserModel.findById(user._id)
        expect(deletedUser).toBeNull()
    })
})
