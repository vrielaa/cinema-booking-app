import { Router } from "express";
import { db } from "../db/database.js";
import { delay, parseMovie, parsePage } from "../utils.js";

export const moviesRouter = Router();

/**
 * @openapi
 * /api/movies:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get a paginated list of movies
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: A paginated list of movies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PaginatedMoviesResponse"
 */
moviesRouter.get("/", async (req, res) => {
  //implement pagination
  const movieResponseDelay =
    process.env.NODE_ENV === "development"
      ? Number(process.env.DELAY_MS ?? 0)
      : 0;

  if (movieResponseDelay > 0) {
    await delay(movieResponseDelay);
  }

  const page = parsePage(req.query.page);
  const maxMoviesPerPage = 16;
  const offset = (page - 1) * maxMoviesPerPage;

  const totalMovies = db
    .prepare("SELECT COUNT(*) AS count FROM movies")
    .get().count;

  const totalPages = Math.max(Math.ceil(totalMovies / maxMoviesPerPage), 1);

  const movies = db
    .prepare("SELECT * FROM movies ORDER BY id ASC LIMIT ? OFFSET ?")
    .all(maxMoviesPerPage, offset);

  const parsedMovies = movies.map(parseMovie);

  res.json({
    movies: parsedMovies,
    pagination: {
      currentPage: page,
      totalPages,
      totalMovies,
    },
  });
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
 *         description: TMDB genre ID. Use all or omit the parameter to include every genre.
 *         example: "80"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Movies matching the selected filters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PaginatedMoviesResponse"
 */
moviesRouter.get("/search", async (req, res) => {
  const movieResponseDelay =
    process.env.NODE_ENV === "development"
      ? Number(process.env.DELAY_MS ?? 0)
      : 0;

  if (movieResponseDelay > 0) {
    await delay(movieResponseDelay);
  }

  const genreFromQuery = req.query.genre;

  let genreId = genreFromQuery !== "all" ? parseInt(genreFromQuery, 10) : "all";

  const title = req.query.title || "";

  let query = "SELECT * FROM movies WHERE 1 = 1";
  const params = [];

  if (title) {
    query += " AND title LIKE ?";
    params.push(`%${title}%`);
  }

  if (genreId && genreId !== "all") {
    query += `
      AND EXISTS (
        SELECT 1
        FROM json_each(movies.genres) AS genre
        WHERE json_extract(genre.value, '$.id') = ?
        )`;
    params.push(genreId);
  }

  //paginate the results
  const page = parsePage(req.query.page);
  const maxMoviesPerPage = 16;
  const offset = (page - 1) * maxMoviesPerPage;

  const totalMovies = db
    .prepare(`SELECT COUNT(*) AS count FROM (${query})`)
    .get(...params).count;
  const totalPages = Math.max(Math.ceil(totalMovies / maxMoviesPerPage), 1);

  query += " ORDER BY id ASC LIMIT ? OFFSET ?";
  params.push(maxMoviesPerPage, offset);

  const movies = db.prepare(query).all(...params);

  res.json({
    movies: movies.map(parseMovie),
    pagination: {
      currentPage: page,
      totalPages,
      totalMovies,
    },
  });
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

  res.json(parseMovie(movie));
});
