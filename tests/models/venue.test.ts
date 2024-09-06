import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { VenueModel } from "../../src/models/venue"
import { UserModel } from "../../src/models/user"

jest.setTimeout(30000)

describe("VenueModel", () => {
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
        await VenueModel.deleteMany({})
        await UserModel.deleteMany({})
    })

    it("should create and save a venue successfully", async () => {
        const user = await UserModel.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        })

        const venueData = {
            name: "Test Venue",
            location: "Test Location",
            capacity: 500,
            description: "A great place for events.",
            createdBy: user._id,
        }

        const newVenue = new VenueModel(venueData)
        const savedVenue = await newVenue.save()

        expect(savedVenue._id).toBeDefined()
        expect(savedVenue.name).toBe(venueData.name)
        expect(savedVenue.location).toBe(venueData.location)
        expect(savedVenue.capacity).toBe(venueData.capacity)
        expect(savedVenue.description).toBe(venueData.description)
        expect(savedVenue.createdBy).toEqual(user._id)
    })

    it("should find a venue by name", async () => {
        const user = await UserModel.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        })

        const venueData = {
            name: "Find Venue",
            location: "Find Location",
            capacity: 1000,
            description: "Find this place.",
            createdBy: user._id,
        }

        await VenueModel.create(venueData)
        const foundVenue = await VenueModel.findOne({ name: "Find Venue" })

        expect(foundVenue).not.toBeNull()
        expect(foundVenue?.location).toBe(venueData.location)
    })

    it("should update a venue's capacity", async () => {
        const user = await UserModel.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        })

        const venueData = {
            name: "Update Venue",
            location: "Update Location",
            capacity: 300,
            description: "Update this place.",
            createdBy: user._id,
        }

        const venue = await VenueModel.create(venueData)
        venue.capacity = 600
        const updatedVenue = await venue.save()

        expect(updatedVenue.capacity).toBe(600)
    })

    it("should delete a venue", async () => {
        const user = await UserModel.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        })

        const venueData = {
            name: "Delete Venue",
            location: "Delete Location",
            capacity: 800,
            description: "Delete this place.",
            createdBy: user._id,
        }

        const venue = await VenueModel.create(venueData)
        await VenueModel.deleteOne({ _id: venue._id })

        const deletedVenue = await VenueModel.findById(venue._id)
        expect(deletedVenue).toBeNull()
    })
})
