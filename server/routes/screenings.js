import { Router } from "express";
import { db } from "../db/database.js";

export const screeningsRouter = Router();

// get all screenings
screeningsRouter.get("/", (request, response) => {
  const screenings = db
    .prepare(
      `
      SELECT
        screenings.id,
        screenings.movie_id,
        screenings.room_id,
        screenings.screening_date,
        screenings.screening_time,
        rooms.row_count,
        rooms.seats_per_row,
        movies.title AS movie_title
      FROM screenings
      JOIN movies ON movies.id = screenings.movie_id
      JOIN rooms ON rooms.id = screenings.room_id
      ORDER BY screenings.screening_date, screenings.screening_time
      `,
    )
    .all();

  response.json(screenings);
});

//get all screening for movie id
screeningsRouter.get("/:movieId", (request, response) => {
  const { movieId } = request.params;

  const screenings = db
    .prepare(
      `
      SELECT
        screenings.id,
        screenings.movie_id,
        screenings.room_id,
        screenings.screening_date,
        screenings.screening_time,
        rooms.row_count,
        rooms.seats_per_row,
        movies.title AS movie_title
      FROM screenings
      JOIN movies ON movies.id = screenings.movie_id
      JOIN rooms ON rooms.id = screenings.room_id
      WHERE movies.id = ?
      ORDER BY screenings.screening_date, screenings.screening_time
      `,
    )
    .all(movieId);

  if (screenings.length === 0) {
    return response
      .status(404)
      .json({ error: "No screenings found for this movie." });
  }

  response.json(screenings);
});

screeningsRouter.get("/screening/:screeningId", (request, response) => {
  const { screeningId } = request.params;

  const screening = db
    .prepare(
      `
      SELECT
        screenings.id,
        screenings.movie_id,
        screenings.room_id,
        screenings.screening_date,
        screenings.screening_time,
        rooms.row_count,
        rooms.seats_per_row,
        movies.title AS movie_title
      FROM screenings
      JOIN movies ON movies.id = screenings.movie_id
      JOIN rooms ON rooms.id = screenings.room_id
      WHERE screenings.id = ?
      `,
    )
    .get(screeningId);

  if (!screening) {
    return response.status(404).json({ error: "Screening not found." });
  }

  response.json(screening);
});
