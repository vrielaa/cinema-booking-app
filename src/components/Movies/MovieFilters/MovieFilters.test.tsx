import { render, act, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { fetchGenres, searchMovies } from "../../../api";
import MovieFilters from "./MovieFilters";

vi.mock("../../../api", () => ({
  fetchGenres: vi.fn(),
  searchMovies: vi.fn(),
}));

const fetchGenresMock = vi.mocked(fetchGenres);
const searchMoviesMock = vi.mocked(searchMovies);

const durationCases = [
  ["under-100", "", 99],
  ["100-129", 100, 129],
  ["130-159", 130, 159],
  ["160-plus", 160, ""],
] as const;

describe("MovieFilters", () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });
  it("should display all filter controls", () => {
    render(<MovieFilters setMovies={vi.fn()} setMoviesLoading={vi.fn()} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Browse the programme" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Title" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Genre" })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "Duration" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("should request genres and movies with the initial filters", () => {
    const setMovies = vi.fn();
    const setMoviesLoading = vi.fn();
    render(
      <MovieFilters
        setMovies={setMovies}
        setMoviesLoading={setMoviesLoading}
      />,
    );

    expect(fetchGenresMock).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
    expect(searchMoviesMock).toHaveBeenCalledWith(
      "",
      "all",
      "",
      "",
      setMovies,
      setMoviesLoading,
    );
  });

  it("should search movies with the title filter after a debounce delay", () => {
    vi.useFakeTimers();
    const setMovies = vi.fn();
    const setMoviesLoading = vi.fn();

    render(
      <MovieFilters
        setMovies={setMovies}
        setMoviesLoading={setMoviesLoading}
      />,
    );

    searchMoviesMock.mockClear();

    const inputElement = screen.getByRole("searchbox", { name: "Title" });

    fireEvent.change(inputElement, {
      target: { value: "Batman" },
    });

    expect(searchMoviesMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(searchMoviesMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(searchMoviesMock).toHaveBeenCalledWith(
      "Batman",
      "all",
      "",
      "",
      setMovies,
      setMoviesLoading,
    );
  });

  it("should change the genre filter and search movies", async () => {
    fetchGenresMock.mockImplementationOnce(
      async (setGenres, setGenresLoading) => {
        setGenres(["Action", "Comedy"]);
        setGenresLoading(false);
      },
    );

    const setMovies = vi.fn();
    const setMoviesLoading = vi.fn();
    const user = userEvent.setup();

    render(
      <MovieFilters
        setMovies={setMovies}
        setMoviesLoading={setMoviesLoading}
      />,
    );

    searchMoviesMock.mockClear();

    const genreSelect = screen.getByRole("combobox", { name: "Genre" });

    expect(genreSelect).toBeEnabled();

    await user.selectOptions(genreSelect, "Action");
    expect(genreSelect).toHaveValue("Action");

    expect(searchMoviesMock).toHaveBeenCalledWith(
      "",
      "Action",
      "",
      "",
      setMovies,
      setMoviesLoading,
    );
  });

  it.each(durationCases)(
    "should search movies with the %s duration filter",
    async (durationValue, expectedMinDuration, expectedMaxDuration) => {
      const setMovies = vi.fn();
      const setMoviesLoading = vi.fn();
      const user = userEvent.setup();

      render(
        <MovieFilters
          setMovies={setMovies}
          setMoviesLoading={setMoviesLoading}
        />,
      );

      searchMoviesMock.mockClear();

      const durationSelect = screen.getByRole("combobox", { name: "Duration" });

      await user.selectOptions(durationSelect, durationValue);
      expect(durationSelect).toHaveValue(durationValue);

      expect(searchMoviesMock).toHaveBeenCalledWith(
        "",
        "all",
        expectedMinDuration,
        expectedMaxDuration,
        setMovies,
        setMoviesLoading,
      );
    },
  );

  it("should reset all filters when the Clear button is clicked", async () => {
    fetchGenresMock.mockImplementationOnce(
      async (setGenres, setGenresLoading) => {
        setGenres(["Action", "Comedy"]);
        setGenresLoading(false);
      },
    );

    const setMovies = vi.fn();
    const setMoviesLoading = vi.fn();
    const user = userEvent.setup();

    render(
      <MovieFilters
        setMovies={setMovies}
        setMoviesLoading={setMoviesLoading}
      />,
    );

    const titleInput = screen.getByRole("searchbox", { name: "Title" });
    const genreSelect = screen.getByRole("combobox", { name: "Genre" });
    const durationSelect = screen.getByRole("combobox", { name: "Duration" });
    const clearButton = screen.getByRole("button", { name: "Clear" });

    await user.type(titleInput, "Batman");
    await user.selectOptions(genreSelect, "Action");
    await user.selectOptions(durationSelect, "100-129");

    expect(titleInput).toHaveValue("Batman");
    expect(genreSelect).toHaveValue("Action");
    expect(durationSelect).toHaveValue("100-129");

    searchMoviesMock.mockClear();

    await user.click(clearButton);

    expect(titleInput).toHaveValue("");
    expect(genreSelect).toHaveValue("all");
    expect(durationSelect).toHaveValue("all");

    expect(searchMoviesMock).toHaveBeenCalledWith(
      "",
      "all",
      "",
      "",
      setMovies,
      setMoviesLoading,
    );
  });
});
