import { db } from "../db/database.js";
import { fetchPopularMoviesFromTMDB } from "../services/tmdb.js";

const numberOfTmdbPages = 4;
const minimumScreeningsPerMovie = 3;
const maximumScreeningsPerMovie = 8;
const programmeLengthInDays = 14;
const maximumInsertAttempts = 50;

const screeningTimes = ["11:00", "13:30", "16:00", "18:30", "21:00"];

function getRandomInteger(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function getRandomItem(items) {
  const index = getRandomInteger(0, items.length - 1);

  return items[index];
}

function getRandomFutureDate(numberOfDays) {
  const date = new Date();
  const daysToAdd = getRandomInteger(0, numberOfDays - 1);

  date.setDate(date.getDate() + daysToAdd);

  return date.toISOString().slice(0, 10);
}

async function fetchMoviesForProgramme() {
  const pages = [];

  for (let page = 1; page <= numberOfTmdbPages; page += 1) {
    const movies = await fetchPopularMoviesFromTMDB(page);
    pages.push(...movies);
  }

  return pages;
}

const findMovieByTmdbId = db.prepare(`
  SELECT id
  FROM movies
  WHERE tmdb_id = ?
`);

const insertMovie = db.prepare(`
  INSERT INTO movies (
    tmdb_id,
    title,
    genres,
    description,
    poster_path
  )
  VALUES (?, ?, ?, ?, ?)
`);

const updateMovie = db.prepare(`
  UPDATE movies
  SET
    title = ?,
    genres = ?,
    description = ?,
    poster_path = ?
  WHERE tmdb_id = ?
`);

const insertScreening = db.prepare(`
  INSERT OR IGNORE INTO screenings (
    movie_id,
    room_id,
    screening_date,
    screening_time
  )
  VALUES (?, ?, ?, ?)
`);

function saveMovie(movie) {
  const existingMovie = findMovieByTmdbId.get(movie.id);

  if (existingMovie) {
    updateMovie.run(
      movie.title,
      JSON.stringify(movie.genres),
      movie.description,
      movie.poster_path,
      movie.id,
    );

    return {
      localMovieId: existingMovie.id,
      isNew: false,
    };
  }

  const result = insertMovie.run(
    movie.id,
    movie.title,
    JSON.stringify(movie.genres),
    movie.description,
    movie.poster_path,
  );

  return {
    localMovieId: Number(result.lastInsertRowid),
    isNew: true,
  };
}

function generateScreenings(localMovieId, roomIds) {
  const desiredNumberOfScreenings = getRandomInteger(
    minimumScreeningsPerMovie,
    maximumScreeningsPerMovie,
  );

  let insertedScreenings = 0;
  let attempts = 0;

  while (
    insertedScreenings < desiredNumberOfScreenings &&
    attempts < maximumInsertAttempts
  ) {
    attempts += 1;

    const roomId = getRandomItem(roomIds);
    const screeningDate = getRandomFutureDate(programmeLengthInDays);
    const screeningTime = getRandomItem(screeningTimes);

    const result = insertScreening.run(
      localMovieId,
      roomId,
      screeningDate,
      screeningTime,
    );

    insertedScreenings += result.changes;
  }

  return insertedScreenings;
}

const saveProgramme = db.transaction((movies, roomIds) => {
  let insertedMovies = 0;
  let updatedMovies = 0;
  let insertedScreenings = 0;

  for (const movie of movies) {
    const { localMovieId, isNew } = saveMovie(movie);

    if (isNew) {
      insertedMovies += 1;
      insertedScreenings += generateScreenings(localMovieId, roomIds);
    } else {
      updatedMovies += 1;
    }
  }

  return {
    insertedMovies,
    updatedMovies,
    insertedScreenings,
  };
});

async function synchronizeProgramme() {
  try {
    console.log("Fetching movies from TMDB...");

    const movies = await fetchMoviesForProgramme();

    const roomIds = db
      .prepare("SELECT id FROM rooms")
      .all()
      .map((room) => room.id);

    if (roomIds.length === 0) {
      throw new Error("Cannot generate screenings because no rooms exist.");
    }

    const result = saveProgramme(movies, roomIds);

    console.log("Programme synchronized successfully:");
    console.log(`New movies: ${result.insertedMovies}`);
    console.log(`Updated movies: ${result.updatedMovies}`);
    console.log(`Generated screenings: ${result.insertedScreenings}`);
  } catch (error) {
    console.error("Programme synchronization failed:", error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

await synchronizeProgramme();
