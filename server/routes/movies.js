import { Router } from "express";
import { db } from "../db/database.js";

export const moviesRouter = Router();

moviesRouter.get("/", (req, res) => {
  const movies = db.prepare("SELECT * FROM movies").all();
  res.json(movies);
});

// Search and filter movies
moviesRouter.get("/search", (req, res) => {
  const title = req.query.title || "";
  const genre = req.query.genre || "all";
  const minDuration = req.query.minDuration;
  const maxDuration = req.query.maxDuration;

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

  if (minDuration) {
    query += " AND duration_minutes >= ?";
    params.push(Number(minDuration));
  }

  if (maxDuration) {
    query += " AND duration_minutes <= ?";
    params.push(Number(maxDuration));
  }

  movies = db.prepare(query).all(...params);

  res.json(movies);
});

moviesRouter.get("/genres", (req, res) => {
  const genres = db.prepare("SELECT DISTINCT genre FROM movies").all();
  res.json(genres.map((g) => g.genre));
});

moviesRouter.get("/:movieId", (req, res) => {
  const movieId = req.params.movieId;
  const movie = db.prepare("SELECT * FROM movies WHERE id = ?").get(movieId);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.json(movie);
});
