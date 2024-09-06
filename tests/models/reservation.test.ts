import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { ReservationModel } from "../../src/models/reservation"
import { UserModel } from "../../src/models/user"
import { VenueModel } from "../../src/models/venue"

jest.setTimeout(30000)

describe("ReservationModel", () => {
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
        await ReservationModel.deleteMany({})
        await UserModel.deleteMany({})
        await VenueModel.deleteMany({})
    })

    it("should create and save a reservation successfully", async () => {
        const user = await UserModel.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        })

        const venue = await VenueModel.create({
            name: "Test Venue",
            location: "Test Location",
            capacity: 500,
            description: "A great place for events.",
            createdBy: user._id,
        })

        const reservationData = {
            userId: user._id,
            venueId: venue._id,
            date: new Date(),
            time: "18:00",
            numberOfPeople: 4,
        }

        const newReservation = new ReservationModel(reservationData)
        const savedReservation = await newReservation.save()

        expect(savedReservation._id).toBeDefined()
        expect(savedReservation.userId).toEqual(user._id)
        expect(savedReservation.venueId).toEqual(venue._id)
        expect(savedReservation.numberOfPeople).toBe(
            reservationData.numberOfPeople
        )
    })

    it("should find a reservation by userId", async () => {
        const user = await UserModel.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        })

        const venue = await VenueModel.create({
            name: "Find Venue",
            location: "Find Location",
            capacity: 500,
            description: "Find this place.",
            createdBy: user._id,
        })

        const reservationData = {
            userId: user._id,
            venueId: venue._id,
            date: new Date(),
            time: "20:00",
            numberOfPeople: 2,
        }

        await ReservationModel.create(reservationData)
        const foundReservation = await ReservationModel.findOne({
            userId: user._id,
        })

        expect(foundReservation).not.toBeNull()
        expect(foundReservation?.venueId).toEqual(venue._id)
    })

    it("should update the number of people in a reservation", async () => {
        const user = await UserModel.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        })

        const venue = await VenueModel.create({
            name: "Update Venue",
            location: "Update Location",
            capacity: 300,
            description: "Update this place.",
            createdBy: user._id,
        })

        const reservationData = {
            userId: user._id,
            venueId: venue._id,
            date: new Date(),
            time: "19:00",
            numberOfPeople: 5,
        }

        const reservation = await ReservationModel.create(reservationData)
        reservation.numberOfPeople = 10
        const updatedReservation = await reservation.save()

        expect(updatedReservation.numberOfPeople).toBe(10)
    })

    it("should delete a reservation", async () => {
        const user = await UserModel.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        })

        const venue = await VenueModel.create({
            name: "Delete Venue",
            location: "Delete Location",
            capacity: 200,
            description: "Delete this place.",
            createdBy: user._id,
        })

        const reservationData = {
            userId: user._id,
            venueId: venue._id,
            date: new Date(),
            time: "21:00",
            numberOfPeople: 8,
        }

        const reservation = await ReservationModel.create(reservationData)
        await ReservationModel.deleteOne({ _id: reservation._id })

        const deletedReservation = await ReservationModel.findById(
            reservation._id
        )
        expect(deletedReservation).toBeNull()
    })
})
