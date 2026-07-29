import { Router } from "express";
import { db } from "../db/database.js";

export const bookingsRouter = Router();

bookingsRouter.post("/", (request, response) => {
  const { screeningId, customerName, seats } = request.body;

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

bookingsRouter.get("/", (request, response) => {
  const bookings = db.prepare("SELECT * FROM bookings").all();
  response.json(bookings);
});

//taken seats for a specific screening

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
