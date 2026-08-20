import { expect, test } from "./fixtures/booking.fixture.ts";

test("shows an error when booking data cannot be loaded", async ({
  bookingPage,
}) => {
  await bookingPage.page.route(
    "**/api/screenings/screening/1",
    async (route) => {
      await route.abort();
    },
  );

  await bookingPage.page.goto("/booking/1");

  await expect(bookingPage.page.getByRole("alert")).toHaveText(
    "Failed to load screening.",
  );
});
