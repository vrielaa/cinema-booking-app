import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Movie, Pagination } from "../types/movie";
import createJsonResponse from "../test/createJsonResponse";
import {
  fetchGenres,
  fetchMovie,
  fetchMovies,
  searchMovies,
} from "./moviesApi";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// MOVIE
const setMovie = vi.fn();
const setMovieLoading = vi.fn();

const movie1: Movie = {
  id: 1,
  title: "Test Movie",
  genres: [{ id: 28, name: "Action" }],
  description: "A test movie for unit testing.",
  poster_path: "/path/to/poster.jpg",
};

const movie2: Movie = {
  id: 2,
  title: "Another Test Movie",
  genres: [{ id: 35, name: "Comedy" }],
  description: "Another test movie for unit testing.",
  poster_path: "/path/to/poster2.jpg",
};

const movies = [movie1, movie2];

const pagination: Pagination = {
  currentPage: 1,
  totalPages: 5,
  totalMovies: 100,
};

// MOVIES
const setMovies = vi.fn();
const setMoviesLoading = vi.fn();

const moviesResponse = {
  movies,
  pagination,
};

describe("fetchMovie", () => {
  it("should request the movie from /api/movies/1", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(movie1));

    await fetchMovie(1, setMovie, setMovieLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/movies/1");
  });

  it("should store the movie and finish loading after a successful response", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(movie1));

    await fetchMovie(1, setMovie, setMovieLoading);

    expect(setMovieLoading).toHaveBeenCalledTimes(2);
    expect(setMovieLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMovieLoading).toHaveBeenNthCalledWith(2, false);
    expect(setMovie).toHaveBeenCalledWith(movie1);
  });

  it("should throw and avoid updating the movie when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await expect(fetchMovie(1, setMovie, setMovieLoading)).rejects.toThrow(
      "Failed to load movie.",
    );

    expect(setMovieLoading).toHaveBeenCalledTimes(2);
    expect(setMovieLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMovieLoading).toHaveBeenNthCalledWith(2, false);
    expect(setMovie).not.toHaveBeenCalled();
  });
});

describe("fetchMovies", () => {
  it("should fetch movies, store them, and finish loading", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(moviesResponse));

    await fetchMovies(setMovies, setMoviesLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/movies?page=1");
    expect(setMovies).toHaveBeenCalledWith(movies);
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when the response is not ok", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await fetchMovies(setMovies, setMoviesLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching movies:",
      expect.objectContaining({
        message: "Network response was not ok",
      }),
    );
    expect(setMovies).not.toHaveBeenCalled();
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when fetch rejects", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockRejectedValueOnce(new Error("Unexpected error"));

    await fetchMovies(setMovies, setMoviesLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching movies:",
      expect.objectContaining({
        message: "Unexpected error",
      }),
    );
  });
});

describe("searchMovies", () => {
  it("should request movies using the provided search parameters", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(moviesResponse));

    await searchMovies(
      "Test",
      { id: 28, name: "Action" },
      setMovies,
      setMoviesLoading,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/movies/search?title=Test&genre=28&page=1",
    );
    expect(setMovies).toHaveBeenCalledWith(movies);
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should encode search parameters to handle special characters", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(moviesResponse));

    await searchMovies(
      "Test Movie",
      { id: 28, name: "Action & Adventure" },
      setMovies,
      setMoviesLoading,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/movies/search?title=Test%20Movie&genre=28&page=1",
    );
    expect(setMovies).toHaveBeenCalledWith(movies);
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when the response is not ok", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await searchMovies(
      "Test",
      { id: 28, name: "Action" },
      setMovies,
      setMoviesLoading,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error searching movies:",
      expect.objectContaining({
        message: "Network response was not ok",
      }),
    );
    expect(setMovies).not.toHaveBeenCalled();
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });
});

describe("fetchGenres", () => {
  const genresResponse = ["Action", "Comedy", "Drama"];
  const setGenres = vi.fn();
  const setGenresLoading = vi.fn();

  it("should fetch genres, store them, and finish loading", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(genresResponse));

    await fetchGenres(setGenres, setGenresLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/movies/genres");
    expect(setGenres).toHaveBeenCalledWith(genresResponse);
    expect(setGenresLoading).toHaveBeenCalledTimes(2);
    expect(setGenresLoading).toHaveBeenNthCalledWith(1, true);
    expect(setGenresLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when the response is not ok", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await fetchGenres(setGenres, setGenresLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching genres:",
      expect.objectContaining({
        message: "Network response was not ok",
      }),
    );
    expect(setGenres).not.toHaveBeenCalled();
    expect(setGenresLoading).toHaveBeenNthCalledWith(1, true);
    expect(setGenresLoading).toHaveBeenNthCalledWith(2, false);
  });
});
