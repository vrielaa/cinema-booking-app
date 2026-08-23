import { expect, test } from "./fixtures/programme.fixture.js";

test.describe("Movie catalogue", () => {
  test.beforeEach(async ({ page, programmeMovies }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: programmeMovies[0].title,
      }),
    ).toBeVisible();
  });

  test("displays the movie catalogue", async ({ page, programmeMovies }) => {
    await expect(
      page.getByRole("button", {
        name: programmeMovies[0].title,
      }),
    ).toBeVisible();
  });

  test("restores movie filters from the URL", async ({
    page,
    programmeMovies,
  }) => {
    const movie = programmeMovies[0];
    const genre = movie.genres[0];
    const searchParams = new URLSearchParams({
      title: movie.title,
      genre: String(genre.id),
      page: "1",
    });

    await page.goto(`/movies?${searchParams.toString()}`);

    await expect(page.getByRole("searchbox", { name: "Title" })).toHaveValue(
      movie.title,
    );
    await expect(page.getByRole("combobox", { name: "Genre" })).toHaveValue(
      String(genre.id),
    );
    await expect(page.getByRole("button", { name: movie.title })).toBeVisible();
  });

  test("filters a movie from the second page and resets pagination", async ({
    page,
    secondPageMovie,
  }) => {
    const titleFilterInput = page.getByRole("searchbox", {
      name: "Title",
    });

    const nextButton = page.getByRole("button", {
      name: "Next",
    });

    const movieCard = page.getByRole("button", {
      name: secondPageMovie.title,
    });

    await expect(page.getByText(/^Page 1 of/)).toBeVisible();

    await expect(movieCard).toHaveCount(0);

    await nextButton.click();

    await expect(page.getByText(/^Page 2 of/)).toBeVisible();
    await expect(movieCard).toBeVisible();

    await titleFilterInput.fill(secondPageMovie.title);

    await expect
      .poll(() => new URL(page.url()).searchParams.get("title"))
      .toBe(secondPageMovie.title);
    await expect
      .poll(() => new URL(page.url()).searchParams.get("page"))
      .toBe("1");

    await expect(page.getByText(/^Page 1 of/)).toBeVisible();

    await expect(page.getByTestId("movie-card")).toHaveCount(1);
    await expect(movieCard).toBeVisible();
  });

  test("filters movies by genre", async ({ page, programmeMovies }) => {
    const genreFilterSelect = page.getByRole("combobox", {
      name: "Genre",
    });
    const genre = programmeMovies[0].genres[0];

    const filteredMoviesResponse = page.waitForResponse((response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/movies/search" &&
        url.searchParams.get("genre") === String(genre.id) &&
        response.ok()
      );
    });

    await genreFilterSelect.selectOption(String(genre.id));
    await filteredMoviesResponse;

    await expect(genreFilterSelect).toHaveValue(String(genre.id));

    const allMovieCards = page.getByTestId("movie-card");

    await expect(allMovieCards.first()).toBeVisible();
    const allMovieCardsCount = await allMovieCards.count();

    const movieCards = page.getByRole("button", {
      name: genre.name,
    });

    await expect(movieCards).toHaveCount(allMovieCardsCount);
  });

  test("clears filters and sets page to 1", async ({
    page,
    programmeMovies,
  }) => {
    const firstMovieCard = page.getByRole("button", {
      name: programmeMovies[0].title,
    });

    await expect(firstMovieCard).toBeVisible();

    const titleFilterInput = page.getByRole("searchbox", {
      name: "Title",
    });

    const genreFilterSelect = page.getByRole("combobox", {
      name: "Genre",
    });

    const genre = programmeMovies[0].genres[0];

    const clearFiltersButton = page.getByRole("button", {
      name: "Clear",
    });

    await titleFilterInput.fill("toy story");
    await genreFilterSelect.selectOption(String(genre.id));

    await expect(titleFilterInput).toHaveValue("toy story");
    await expect(genreFilterSelect).toHaveValue(String(genre.id));

    await expect(firstMovieCard).toHaveCount(0);

    await clearFiltersButton.click();

    await expect(titleFilterInput).toHaveValue("");
    await expect(genreFilterSelect).toHaveValue("all");
    await expect(firstMovieCard).toBeVisible();
  });

  test("opens and closes movie details dialog for a selected movie", async ({
    page,
    programmeMovies,
  }) => {
    const firstMovieCard = page.getByRole("button", {
      name: programmeMovies[0].title,
    });

    await expect(firstMovieCard).toBeVisible();

    await firstMovieCard.click();
    const movieDialog = page.getByRole("dialog");
    await expect(movieDialog).toBeVisible();

    await expect(
      movieDialog.getByRole("heading", {
        name: programmeMovies[0].title,
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
