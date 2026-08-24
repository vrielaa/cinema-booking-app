import { expect, test } from "./fixtures/booking.fixture.ts";

test.describe("Booking flow", () => {
  test("should move to booking page when a screening for a movie is selected", async ({
    bookingPage,
    programmeMovies,
  }) => {
    await bookingPage.page.goto("/");

    const firstMovieCard = bookingPage.page.getByRole("button", {
      name: programmeMovies[0].title,
    });

    await expect(firstMovieCard).toBeVisible();

    await firstMovieCard.click();

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

  test("should load booking page correctly", async ({
    bookingPage,
    programmeMovies,
  }) => {
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
        name: programmeMovies[0].title,
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
