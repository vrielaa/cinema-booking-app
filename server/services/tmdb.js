import dotenv from "dotenv";
dotenv.config();

const tmdbApiUrl = process.env.TMDB_URL;
const tmdbApiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = process.env.TMDB_BASE_URL;
const posterSize = "w500";

function getTmdbHeaders() {
  if (!tmdbApiKey) {
    throw new Error("TMDB_API_KEY is not configured.");
  }

  return {
    accept: "application/json",
    Authorization: `Bearer ${tmdbApiKey}`,
  };
}

async function fetchFromTMDB(path) {
  if (!tmdbApiUrl) {
    throw new Error("TMDB_API_URL is not configured.");
  }

  const response = await fetch(`${tmdbApiUrl}${path}`, {
    headers: getTmdbHeaders(),
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  return response.json();
}

export async function fetchGenresFromTMDB() {
  const data = await fetchFromTMDB("/genre/movie/list?language=en-US");

  return data.genres.map((genre) => ({
    id: genre.id,
    name: genre.name.toUpperCase(),
  }));
}

export async function fetchPopularMoviesFromTMDB(page = 1) {
  const [data, availableGenres] = await Promise.all([
    fetchFromTMDB(`/movie/popular?language=en-US&page=${page}`),
    fetchGenresFromTMDB(),
  ]);

  return data.results.map((movie) => mapTmdbMovie(movie, availableGenres));
}

export function getMoviePosterUrl(posterPath) {
  if (!posterPath || !tmdbBaseUrl) {
    return null;
  }

  return `${tmdbBaseUrl}${posterSize}${posterPath}`;
}

export function getMovieBackdropUrl(backdropPath) {
  if (!backdropPath || !tmdbBaseUrl) {
    return null;
  }

  return `${tmdbBaseUrl}w1280${backdropPath}`;
}
export async function searchMoviesFromTMDB(title, genreId, page = 1) {
  const searchParams = new URLSearchParams({
    query: title.trim(),
    language: "en-US",
    page: String(page),
  });

  const [data, availableGenres] = await Promise.all([
    fetchFromTMDB(`/search/movie?${searchParams.toString()}`),
    fetchGenresFromTMDB(),
  ]);

  const movies =
    genreId === "all"
      ? data.results
      : data.results.filter((movie) =>
          movie.genre_ids.includes(Number(genreId)),
        );

  return movies.map((movie) => mapTmdbMovie(movie, availableGenres));
}

function mapTmdbMovie(movie, availableGenres) {
  const genres = availableGenres.filter((genre) =>
    movie.genre_ids.includes(genre.id),
  );

  return {
    id: movie.id,
    title: movie.title,
    description: movie.overview || null,
    genres,
    poster_path: getMoviePosterUrl(movie.poster_path),
  };
}

export async function discoverMoviesByGenreFromTMDB(genreId, page = 1) {
  const searchParams = new URLSearchParams({
    with_genres: String(genreId),
    language: "en-US",
    page: String(page),
    include_adult: "false",
  });

  const [data, availableGenres] = await Promise.all([
    fetchFromTMDB(`/discover/movie?${searchParams.toString()}`),
    fetchGenresFromTMDB(),
  ]);

  return data.results.map((movie) => mapTmdbMovie(movie, availableGenres));
}
