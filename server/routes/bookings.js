import { Router } from "express";
import { db } from "../db/database.js";

export const bookingsRouter = Router();

bookingsRouter.post("/", (request, response) => {
  const { screeningId, customerName, seats } = request.body;

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
