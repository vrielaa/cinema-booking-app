import { expect, test } from "@playwright/test";

test.describe("Booking flow", () => {
  test("should move to booking page when a screening for a movie is selected", async ({
    page,
  }) => {
    await page.goto("/");

    const duneMovieCard = page.getByRole("button", {
      name: /Dune: Part Two/,
    });

    await expect(duneMovieCard).toBeVisible();

    await duneMovieCard.click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();

    const selectScreeningLinks = page.getByRole("link", {
      name: "Select",
    });

    const firstScreeningLink = selectScreeningLinks.first();

    await expect(firstScreeningLink).toBeVisible();

    await firstScreeningLink.click();

    await expect(page).toHaveURL("/booking/1");
  });

  test("should load booking page correctly", async ({ page }) => {
    await page.goto("/booking/1");
    await expect(page).toHaveURL("/booking/1");

    await expect(
      page.getByRole("heading", {
        name: "Choose your seats",
        level: 1,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Dune: Part Two",
        level: 2,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: /A1, (available|taken)/,
      }),
    ).toBeVisible();
  });
});
