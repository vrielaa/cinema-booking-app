import { test as base, expect } from "@playwright/test";
import { BookingPage } from "../pages/BookingPage.ts";

type BookingFixtures = {
  bookingPage: BookingPage;
};

export const test = base.extend<BookingFixtures>({
  bookingPage: async ({ page }, provide) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.goto("1");
    await bookingPage.waitUntilLoaded();

    await provide(bookingPage);
  },
});

export { expect };
