import { Router } from "express";
import { db } from "../db/database.js";

export const screeningsRouter = Router();

// get all screenings
/**
 * @openapi
 * /api/screenings:
 *   get:
 *     tags:
 *       - Screenings
 *     summary: Get all screenings
 *     responses:
 *       200:
 *         description: A list of all screenings with movie and room information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Screening"
 */
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
/**
 * @openapi
 * /api/screenings/{movieId}:
 *   get:
 *     tags:
 *       - Screenings
 *     summary: Get all screenings for a movie
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *         example: 1
 *     responses:
 *       200:
 *         description: A list of screenings for the selected movie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Screening"
 *       404:
 *         description: No screenings found for the movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
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

/**
 * @openapi
 * /api/screenings/screening/{screeningId}:
 *   get:
 *     tags:
 *       - Screenings
 *     summary: Get a screening by ID
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
 *         description: Screening details with movie and room information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Screening"
 *       404:
 *         description: Screening not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
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
