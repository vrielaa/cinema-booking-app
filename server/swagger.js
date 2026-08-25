import swaggerJsdoc from "swagger-jsdoc";
import { Movie } from "./models/Movie.js";
import { Screening } from "./models/Screening.js";
import { Room } from "./models/Room.js";
import { SeatMap } from "./models/SeatMap.js";
import { CreateBookingResponse } from "./models/CreateBookingResponse.js";
import { CreateBookingRequest } from "./models/CreateBookingRequest.js";
import { ErrorResponse } from "./models/ErrorResponse.js";
import { Pagination } from "./models/Pagination.js";
import { PaginatedMoviesResponse } from "./models/PaginatedMoviesResponse.js";
import { User } from "./models/User.js";
import { RegisterRequest } from "./models/RegisterRequest.js";
import { LoginRequest } from "./models/LoginRequest.js";
import { AuthResponse } from "./models/AuthResponse.js";
import { Genre } from "./models/Genre.js";
import { TmdbMovie } from "./models/TmdbMovie.js";

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
      {
        name: "Authentication",
        description: "User accounts and cookie-based sessions",
      },
      {
        name: "TMDB",
        description: "Third-party movie catalogue data from TMDB",
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
        Pagination: Pagination,
        PaginatedMoviesResponse: PaginatedMoviesResponse,
        User: User,
        RegisterRequest: RegisterRequest,
        LoginRequest: LoginRequest,
        AuthResponse: AuthResponse,
        Genre: Genre,
        TmdbMovie: TmdbMovie,
      },
      securitySchemes: {
        cinemaSession: {
          type: "apiKey",
          in: "cookie",
          name: "cinema-session",
          description: "HttpOnly session cookie created after login",
        },
      },
    },
  },
  apis: ["./server/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
