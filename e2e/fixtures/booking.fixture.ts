import { test as base, expect } from "@playwright/test";
import { BookingPage } from "../pages/BookingPage.ts";
import { randomUUID } from "node:crypto";
import type { Movie } from "../../src/types/movie.ts";
import type { PaginatedMoviesResponse } from "./programme.fixture.ts";

type BookingFixtures = {
  bookingPage: BookingPage;
  programmeMovies: Movie[];
};

export const test = base.extend<BookingFixtures>({
  bookingPage: async ({ page }, provide) => {
    const email = `e2e-${randomUUID()}@example.com`;
    const password = "password123";

    const registerResponse = await page.request.post("/api/auth/register", {
      data: {
        name: "E2E User",
        email,
        password,
      },
    });

    expect(registerResponse.status()).toBe(201);

    const loginResponse = await page.request.post("/api/auth/login", {
      data: {
        email,
        password,
      },
    });

    expect(loginResponse.ok()).toBe(true);

    const bookingPage = new BookingPage(page);

    await bookingPage.goto("1");
    await bookingPage.waitUntilLoaded();

    await provide(bookingPage);
  },
  programmeMovies: async ({ request }, provide) => {
    const response = await request.get("/api/movies/search?page=1");

    expect(response.ok()).toBe(true);

    const data: PaginatedMoviesResponse = await response.json();

    expect(data.movies.length).toBeGreaterThan(0);

    await provide(data.movies);
  },
});

export { expect };
