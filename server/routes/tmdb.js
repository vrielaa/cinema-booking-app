import { Router } from "express";
import {
  fetchGenresFromTMDB,
  fetchPopularMoviesFromTMDB,
  searchMoviesFromTMDB,
  discoverMoviesByGenreFromTMDB,
} from "../services/tmdb.js";

export const tmdbRouter = Router();

/**
 * @openapi
 * /api/tmdb/genres:
 *   get:
 *     tags:
 *       - TMDB
 *     summary: Get movie genres from TMDB
 *     responses:
 *       200:
 *         description: TMDB movie genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Genre"
 *       502:
 *         description: TMDB request failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
tmdbRouter.get("/genres", async (request, response) => {
  try {
    const genres = await fetchGenresFromTMDB();

    response.json(genres);
  } catch (error) {
    console.error("Failed to fetch TMDB genres:", error);

    response.status(502).json({
      error: "Failed to load genres from TMDB.",
    });
  }
});

/**
 * @openapi
 * /api/tmdb/movies/popular:
 *   get:
 *     tags:
 *       - TMDB
 *     summary: Get popular movies from TMDB
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: TMDB result page
 *     responses:
 *       200:
 *         description: Popular TMDB movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TmdbMovie"
 *       502:
 *         description: TMDB request failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
tmdbRouter.get("/movies/popular", async (request, response) => {
  try {
    const requestedPage = Number(request.query.page ?? 1);
    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const movies = await fetchPopularMoviesFromTMDB(page);

    response.json(movies);
  } catch (error) {
    console.error("Failed to fetch popular TMDB movies:", error);

    response.status(502).json({
      error: "Failed to load popular movies from TMDB.",
    });
  }
});

/**
 * @openapi
 * /api/tmdb/movies/search:
 *   get:
 *     tags:
 *       - TMDB
 *     summary: Search or discover movies through TMDB
 *     description: Returns popular movies when no filters are provided, discovers by genre when only genreId is provided, and searches by title otherwise.
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         example: Batman
 *         description: Full or partial movie title
 *       - in: query
 *         name: genreId
 *         schema:
 *           type: string
 *           default: all
 *         example: "28"
 *         description: TMDB genre ID or all
 *     responses:
 *       200:
 *         description: TMDB movies matching the selected filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TmdbMovie"
 *       502:
 *         description: TMDB request failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
tmdbRouter.get("/movies/search", async (request, response) => {
  try {
    const title =
      typeof request.query.title === "string" ? request.query.title.trim() : "";

    const genreId =
      typeof request.query.genreId === "string" ? request.query.genreId : "all";

    let movies;

    if (!title && genreId === "all") {
      movies = await fetchPopularMoviesFromTMDB();
    } else if (!title) {
      movies = await discoverMoviesByGenreFromTMDB(genreId);
    } else {
      movies = await searchMoviesFromTMDB(title, genreId);
    }

    response.json(movies);
  } catch (error) {
    console.error("Failed to load TMDB movies:", error);

    response.status(502).json({
      error: "Failed to load movies from TMDB.",
    });
  }
});
