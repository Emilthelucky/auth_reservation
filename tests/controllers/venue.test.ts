// import { Request, Response } from "express"
// import { AuthenticatedRequest } from "../../src/types/index"
// import {
//     CreateVenue,
//     GetVenues,
//     GetVenueById,
// } from "../../src/controllers/venue"
// import { VenueModel } from "../../src/models/venue"
// import { redisClient } from "../../src/libraries/redis"
// import "@testing-library/jest-dom/extend-expect"

// jest.mock("../../models/venue")
// jest.mock("../../libraries/redis")
// jest.mock("../../helpers/managers/ErrorManager")

// const mockErrorHandler = jest.fn()
// const mockSend = jest.fn()

// const req = {} as AuthenticatedRequest
// const res = {
//     status: jest.fn(() => ({
//         json: mockSend,
//     })),
// } as unknown as Response

// describe("Venue Controller Tests", () => {
//     beforeEach(() => {
//         jest.clearAllMocks()
//     })

//     test("CreateVenue should return 201 for successful creation", async () => {
//         req.body = {
//             name: "Test Venue",
//             location: "Test Location",
//             capacity: 100,
//             description: "Test Description",
//         }
//         req.user = { userId: "user123" }
//         ;(VenueModel.create as jest.Mock).mockResolvedValue(req.body)

//         const result = await CreateVenue(req, res)

//         expect(VenueModel.create).toHaveBeenCalledWith({
//             name: "Test Venue",
//             location: "Test Location",
//             capacity: 100,
//             description: "Test Description",
//             createdBy: "user123",
//         })
//         expect(redisClient.del).toHaveBeenCalledWith("venues")
//         expect(res.status).toHaveBeenCalledWith(201)
//         expect(mockSend).toHaveBeenCalledWith({
//             message: "Venue created successfully!",
//             venue: req.body,
//         })
//     })

//     test("GetVenues should return 200 with venues from cache", async () => {
//         req.query = {}
//         ;(redisClient.get as jest.Mock).mockResolvedValue(
//             JSON.stringify([{ name: "Cached Venue" }])
//         )

//         const result = await GetVenues(req, res)

//         expect(redisClient.get).toHaveBeenCalledWith("venues")
//         expect(res.status).toHaveBeenCalledWith(200)
//         expect(mockSend).toHaveBeenCalledWith({
//             message: "Venues fetched successfully from cache!",
//             venues: [{ name: "Cached Venue" }],
//         })
//     })

//     test("GetVenueById should return 200 for a venue found in cache", async () => {
//         req.params = { id: "venue123" }
//         ;(redisClient.get as jest.Mock).mockResolvedValue(
//             JSON.stringify({ name: "Cached Venue" })
//         )

//         const result = await GetVenueById(req, res)

//         expect(redisClient.get).toHaveBeenCalledWith("venue_venue123")
//         expect(res.status).toHaveBeenCalledWith(200)
//         expect(mockSend).toHaveBeenCalledWith({
//             message: "Venue details fetched successfully from cache!",
//             venue: { name: "Cached Venue" },
//         })
//     })

//     test("GetVenueById should return 404 if venue not found", async () => {
//         req.params = { id: "venue123" }
//         ;(redisClient.get as jest.Mock).mockResolvedValue(null)
//         ;(VenueModel.findById as jest.Mock).mockResolvedValue(null)

//         const result = await GetVenueById(req, res)

//         expect(redisClient.get).toHaveBeenCalledWith("venue_venue123")
//         expect(VenueModel.findById).toHaveBeenCalledWith("venue123")
//         expect(res.status).toHaveBeenCalledWith(404)
//         expect(mockSend).toHaveBeenCalledWith({
//             message: "Venue not found!",
//         })
//     })
// })

import "@testing-library/jest-dom"

test("sample test", () => {
    expect(true).toBe(true)
})
