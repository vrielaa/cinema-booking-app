import { expect, test as base } from "@playwright/test";
import type { Movie } from "../../src/types/movie.js";

type ProgrammeFixtures = {
  programmeMovies: Movie[];
  secondPageMovie: Movie;
};

export type PaginatedMoviesResponse = {
  movies: Movie[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMovies: number;
  };
};

export const test = base.extend<ProgrammeFixtures>({
  programmeMovies: async ({ request }, provide) => {
    const response = await request.get("/api/movies/search?page=1");

    expect(response.ok()).toBe(true);

    const data: PaginatedMoviesResponse = await response.json();

    expect(data.movies.length).toBeGreaterThan(0);

    await provide(data.movies);
  },

  secondPageMovie: async ({ request }, provide) => {
    const response = await request.get("/api/movies/search?page=2");

    expect(response.ok()).toBe(true);

    const data: PaginatedMoviesResponse = await response.json();

    expect(data.pagination.currentPage).toBe(2);
    expect(data.movies.length).toBeGreaterThan(0);

    await provide(data.movies[0]);
  },
});

export { expect };
