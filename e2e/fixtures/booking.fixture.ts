import { test as base, expect } from "@playwright/test";
import { BookingPage } from "../pages/BookingPage.ts";
import { randomUUID } from "node:crypto";

type BookingFixtures = {
  bookingPage: BookingPage;
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
});

export { expect };
