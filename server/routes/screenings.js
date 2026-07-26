import { Router } from "express";
import { db } from "../db/database.js";

export const screeningsRouter = Router();

screeningsRouter.get("/", (request, response) => {
  const screenings = db
    .prepare(
      `
      SELECT
        screenings.id,
        screenings.screening_date,
        screenings.screening_time,
        screenings.room_name,
        movies.title AS movie_title
      FROM screenings
      JOIN movies ON movies.id = screenings.movie_id
      ORDER BY screenings.screening_date, screenings.screening_time
      `,
    )
    .all();

  response.json(screenings);
});
