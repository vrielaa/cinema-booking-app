import { expect, test } from "@playwright/test";

test.describe("Movie catalogue", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Browse the programme",
      }),
    ).toBeVisible();
  });

  test("displays the movie catalogue", async ({ page }) => {
    await expect(
      page.getByRole("button", {
        name: /Dune: Part Two/,
      }),
    ).toBeVisible();
  });

  test("filters movies by title", async ({ page }) => {
    const titleFilterInput = page.getByRole("searchbox", {
      name: "Title",
    });

    const duneMovieCard = page.getByRole("button", {
      name: /Dune: Part Two/,
    });

    await expect(duneMovieCard).toBeVisible();

    await titleFilterInput.fill("Batman");

    const batmanMovieCard = page.getByRole("button", {
      name: /The Batman/,
    });
    await expect(batmanMovieCard).toBeVisible();

    await expect(duneMovieCard).toHaveCount(0);
  });

  test("filters movies by genre", async ({ page }) => {
    const genreFilterSelect = page.getByRole("combobox", {
      name: "Genre",
    });

    const duneMovieCard = page.getByRole("button", {
      name: /Dune: Part Two/,
    });

    await expect(duneMovieCard).toBeVisible();

    await genreFilterSelect.selectOption("ACTION");

    const maverickMovieCard = page.getByRole("button", {
      name: /Maverick/,
    });
    await expect(maverickMovieCard).toBeVisible();

    await expect(duneMovieCard).toHaveCount(0);
  });

  test("clears filters", async ({ page }) => {
    const duneMovieCard = page.getByRole("button", {
      name: /Dune: Part Two/,
    });

    await expect(duneMovieCard).toBeVisible();

    const titleFilterInput = page.getByRole("searchbox", {
      name: "Title",
    });

    const genreFilterSelect = page.getByRole("combobox", {
      name: "Genre",
    });

    const clearFiltersButton = page.getByRole("button", {
      name: "Clear",
    });

    await titleFilterInput.fill("Batman");
    await genreFilterSelect.selectOption("ACTION");

    await expect(titleFilterInput).toHaveValue("Batman");
    await expect(genreFilterSelect).toHaveValue("ACTION");

    await expect(duneMovieCard).toHaveCount(0);

    await clearFiltersButton.click();

    await expect(titleFilterInput).toHaveValue("");
    await expect(genreFilterSelect).toHaveValue("all");
    await expect(duneMovieCard).toBeVisible();
  });

  test("opens and closes movie details dialog for a selected movie", async ({
    page,
  }) => {
    const duneMovieCard = page.getByRole("button", {
      name: /Dune: Part Two/,
    });

    await expect(duneMovieCard).toBeVisible();

    await duneMovieCard.click();
    const movieDialog = page.getByRole("dialog");
    await expect(movieDialog).toBeVisible();

    await expect(
      movieDialog.getByRole("heading", {
        name: /Dune: Part Two/,
      }),
    ).toBeVisible();

    const closeButton = movieDialog.getByRole("button", {
      name: "Close",
    });
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await expect(movieDialog).toHaveCount(0);
  });
});
