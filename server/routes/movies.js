import { Router } from "express";
import { db } from "../db/database.js";

export const moviesRouter = Router();

moviesRouter.get("/", (req, res) => {
  const movies = db.prepare("SELECT * FROM movies").all();
  res.json(movies);
});

moviesRouter.get("/:movieId", (req, res) => {
  const movieId = req.params.movieId;
  const movie = db.prepare("SELECT * FROM movies WHERE id = ?").get(movieId);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.json(movie);
});
