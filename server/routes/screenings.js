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

//get all screening for movie id
screeningsRouter.get("/:movieId", (request, response) => {
  const { movieId } = request.params;

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
      WHERE movies.id = ?
      ORDER BY screenings.screening_date, screenings.screening_time
      `,
    )
    .all(movieId);

  response.json(screenings);
});