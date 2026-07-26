import { Router } from "express";
import { db } from "../db/database.js";

export const moviesRouter = Router();

moviesRouter.get("/", (req, res) => {
  const movies = db.prepare("SELECT * FROM movies").all();
  res.json(movies);
});
