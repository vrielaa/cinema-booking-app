import { Router } from "express";
import {
  fetchGenresFromTMDB,
  fetchPopularMoviesFromTMDB,
  searchMoviesFromTMDB,
  discoverMoviesByGenreFromTMDB,
} from "../services/tmdb.js";

export const tmdbRouter = Router();

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
