import swaggerJsdoc from "swagger-jsdoc";
import { Movie } from "./models/Movie.js";
import { Screening } from "./models/Screening.js";
import { Room } from "./models/Room.js";
import { SeatMap } from "./models/SeatMap.js";
import { CreateBookingResponse } from "./models/CreateBookingResponse.js";
import { CreateBookingRequest } from "./models/CreateBookingRequest.js";
import { ErrorResponse } from "./models/ErrorResponse.js";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Cinema Booking API",
      version: "1.0.0",
      description: "API for movies, screenings, rooms and seat reservations.",
    },
    tags: [
      {
        name: "Movies",
        description: "Movie catalogue and filtering",
      },
      {
        name: "Rooms",
        description: "Cinema room information",
      },
      {
        name: "Screenings",
        description: "Movie screening schedules",
      },
      {
        name: "Bookings",
        description: "Seat availability and reservations",
      },
    ],
    servers: [
      {
        url: "/",
        description: "Current server",
      },
    ],
    components: {
      schemas: {
        Movie: Movie,
        Screening: Screening,
        Room: Room,
        SeatMap: SeatMap,
        CreateBookingResponse: CreateBookingResponse,
        CreateBookingRequest: CreateBookingRequest,
        ErrorResponse: ErrorResponse,
      },
    },
  },
  apis: ["./server/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
