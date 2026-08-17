import { test as base, expect, type Page } from "@playwright/test";

type BookingFixtures = {
  bookingPage: Page;
};

export const test = base.extend<BookingFixtures>({
  bookingPage: async ({ page }, provide) => {
    await page.goto("/booking/1");

    await expect(
      page.getByRole("heading", {
        name: "Choose your seats",
        level: 1,
      }),
    ).toBeVisible();

    await expect(
      page
        .getByRole("button", {
          name: /^[A-Z]\d+, (available|taken)$/,
        })
        .first(),
    ).toBeVisible();

    await provide(page);
  },
});

export { expect };
