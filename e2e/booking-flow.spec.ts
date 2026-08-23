import { expect, test } from "./fixtures/booking.fixture.ts";

test.describe("Booking flow", () => {
  test("should move to booking page when a screening for a movie is selected", async ({
    bookingPage,
  }) => {
    await bookingPage.page.goto("/");

    const spiderManMovieCard = bookingPage.page.getByRole("button", {
      name: "Spider-Man: Brand New Day",
    });

    await expect(spiderManMovieCard).toBeVisible();

    await spiderManMovieCard.click();

    await expect(bookingPage.page.getByRole("dialog")).toBeVisible();
    await expect(bookingPage.page.getByRole("table")).toBeVisible();

    const selectScreeningLinks = bookingPage.page.getByRole("link", {
      name: "Select",
    });

    const firstScreeningLink = selectScreeningLinks.first();

    await expect(firstScreeningLink).toBeVisible();

    await firstScreeningLink.click();

    await expect(bookingPage.page).toHaveURL("/booking/1");
  });

  test("should load booking page correctly", async ({ bookingPage }) => {
    await bookingPage.page.goto("/booking/1");
    await expect(bookingPage.page).toHaveURL("/booking/1");

    await expect(
      bookingPage.page.getByRole("heading", {
        name: "Choose your seats",
        level: 1,
      }),
    ).toBeVisible();

    await expect(
      bookingPage.page.getByRole("heading", {
        name: "Spider-Man: Brand New Day",
        level: 2,
      }),
    ).toBeVisible();

    await expect(
      bookingPage.page.getByRole("button", {
        name: /A1, (available|taken)/,
      }),
    ).toBeVisible();
  });
});
