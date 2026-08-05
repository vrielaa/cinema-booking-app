import { Router } from "express";
import { db } from "../db/database.js";
import { delay } from "../utils.js";

export const bookingsRouter = Router();

/**
 * @openapi
 * /api/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBookingRequest"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateBookingResponse"
 *       409:
 *         description: One of the selected seats has already been reserved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
bookingsRouter.post("/", async (request, response) => {
  const { screeningId, customerName, seats } = request.body;

  const bookingDelay =
    process.env.NODE_ENV === "development"
      ? Number(process.env.DELAY_MS ?? 0)
      : 0;

  if (bookingDelay > 0) {
    await delay(bookingDelay);
  }

  // check if the seats are already taken for the given screening
  const existingBookings = db
    .prepare("SELECT seats FROM bookings WHERE screening_id = ?")
    .all(screeningId);

  const takenSeats = existingBookings.reduce((acc, booking) => {
    const bookedSeats = JSON.parse(booking.seats);

    return { ...acc, ...bookedSeats };
  }, {});

  for (const seat in seats) {
    if (takenSeats[seat]) {
      return response.status(409).json({
        error: `Seat ${seat} has just been reserved. Please select another seat.`,
      });
    }
  }

  const result = db
    .prepare(
      `
      INSERT INTO bookings (screening_id, customer_name, seats)
      VALUES (?, ?, ?)
      `,
    )
    .run(screeningId, customerName, JSON.stringify(seats));

  response.status(201).json({
    id: result.lastInsertRowid,
    screeningId,
    customerName,
    seats,
  });
});

/**
 * @openapi
 * /api/bookings/{screeningId}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get taken seats for a screening
 *     parameters:
 *       - in: path
 *         name: screeningId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Screening ID
 *         example: 1
 *     responses:
 *       200:
 *         description: A map of seats already reserved for the screening
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SeatMap"
 */
bookingsRouter.get("/:screeningId", (request, response) => {
  const { screeningId } = request.params;

  const bookings = db
    .prepare("SELECT seats FROM bookings WHERE screening_id = ?")
    .all(screeningId);

  // Combine all booked seats into a single object
  const takenSeats = bookings.reduce((acc, booking) => {
    const seats = JSON.parse(booking.seats);

    return { ...acc, ...seats };
  }, {});

  response.json(takenSeats);
});
