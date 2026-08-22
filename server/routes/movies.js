import { Router } from "express";
import { db } from "../db/database.js";
import { delay } from "../utils.js";

export const moviesRouter = Router();

/**
 * @openapi
 * /api/movies:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get all movies
 *     responses:
 *       200:
 *         description: A list of all movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Movie"
 */
moviesRouter.get("/", async (req, res) => {
  const movieResponseDelay =
    process.env.NODE_ENV === "development"
      ? Number(process.env.DELAY_MS ?? 0)
      : 0;

  if (movieResponseDelay > 0) {
    await delay(movieResponseDelay);
  }
  const movies = db.prepare("SELECT * FROM movies").all();
  res.json(movies);
});

// Search and filter movies
/**
 * @openapi
 * /api/movies/search:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Search and filter movies
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Part of a movie title
 *         example: Godfather
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Movie genre. Use all or omit the parameter to include every genre.
 *         example: Crime
 *     responses:
 *       200:
 *         description: Movies matching the selected filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Movie"
 */
moviesRouter.get("/search", async (req, res) => {
  const movieResponseDelay =
    process.env.NODE_ENV === "development"
      ? Number(process.env.DELAY_MS ?? 0)
      : 0;

  if (movieResponseDelay > 0) {
    await delay(movieResponseDelay);
  }

  const title = req.query.title || "";
  const genre = req.query.genre || "all";

  let movies;
  let query = "SELECT * FROM movies WHERE 1 = 1";
  const params = [];

  if (title) {
    query += " AND title LIKE ?";
    params.push(`%${title}%`);
  }

  if (genre && genre !== "all") {
    query += " AND genre = ?";
    params.push(genre);
  }

  movies = db.prepare(query).all(...params);

  res.json(movies);
});

/**
 * @openapi
 * /api/movies/genres:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get all movie genres
 *     responses:
 *       200:
 *         description: A list of unique movie genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example:
 *               - Crime
 *               - Drama
 *               - Science Fiction
 */
moviesRouter.get("/genres", (req, res) => {
  const genres = db.prepare("SELECT DISTINCT genre FROM movies").all();
  res.json(genres.map((g) => g.genre));
});

/**
 * @openapi
 * /api/movies/{movieId}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get a movie by ID
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
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Movie"
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
moviesRouter.get("/:movieId", (req, res) => {
  const movieId = req.params.movieId;
  const movie = db.prepare("SELECT * FROM movies WHERE id = ?").get(movieId);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.json(movie);
});
