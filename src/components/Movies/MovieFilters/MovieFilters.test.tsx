import { render, act, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { fetchGenresFromTMDB, searchMovies } from "../../../api";
import MovieFilters from "./MovieFilters";

vi.mock("../../../api", () => ({
  fetchGenresFromTMDB: vi.fn(),
  searchMovies: vi.fn(),
}));

const fetchGenresMock = vi.mocked(fetchGenresFromTMDB);
const searchMoviesMock = vi.mocked(searchMovies);

describe("MovieFilters", () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });
  it("should display all filter controls", () => {
    render(
      <MovieFilters
        setMovies={vi.fn()}
        setMoviesLoading={vi.fn()}
        page={1}
        setPage={vi.fn()}
        setTotalPages={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Browse the programme" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Title" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Genre" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("should request genres and movies with the initial filters", () => {
    const setMovies = vi.fn();
    const setMoviesLoading = vi.fn();
    render(
      <MovieFilters
        setMovies={setMovies}
        setMoviesLoading={setMoviesLoading}
        page={1}
        setPage={vi.fn()}
        setTotalPages={vi.fn()}
      />,
    );

    expect(fetchGenresMock).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
    expect(searchMoviesMock).toHaveBeenCalledWith(
      "",
      null,
      setMovies,
      setMoviesLoading,
      1,
      expect.any(Function),
      expect.any(Function),
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
        page={1}
        setPage={vi.fn()}
        setTotalPages={vi.fn()}
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
      null,
      setMovies,
      setMoviesLoading,
      1,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("should change the genre filter and search movies", async () => {
    fetchGenresMock.mockImplementationOnce(
      async (setGenres, setGenresLoading) => {
        setGenres([
          { id: 28, name: "Action" },
          { id: 35, name: "Comedy" },
        ]);
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
        page={1}
        setPage={vi.fn()}
        setTotalPages={vi.fn()}
      />,
    );

    searchMoviesMock.mockClear();

    const genreSelect = screen.getByRole("combobox", { name: "Genre" });

    expect(genreSelect).toBeEnabled();

    await user.selectOptions(genreSelect, "28");
    expect(genreSelect).toHaveValue("28");

    expect(searchMoviesMock).toHaveBeenCalledWith(
      "",
      { id: 28, name: "Action" },
      setMovies,
      setMoviesLoading,
      1,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("should reset all filters when the Clear button is clicked", async () => {
    fetchGenresMock.mockImplementationOnce(
      async (setGenres, setGenresLoading) => {
        setGenres([
          { id: 28, name: "Action" },
          { id: 35, name: "Comedy" },
        ]);
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
        page={1}
        setPage={vi.fn()}
        setTotalPages={vi.fn()}
      />,
    );

    const titleInput = screen.getByRole("searchbox", { name: "Title" });
    const genreSelect = screen.getByRole("combobox", { name: "Genre" });
    const clearButton = screen.getByRole("button", { name: "Clear" });

    await user.type(titleInput, "Batman");
    await user.selectOptions(genreSelect, "28");

    expect(titleInput).toHaveValue("Batman");
    expect(genreSelect).toHaveValue("28");

    searchMoviesMock.mockClear();

    await user.click(clearButton);

    expect(titleInput).toHaveValue("");
    expect(genreSelect).toHaveValue("all");

    expect(searchMoviesMock).toHaveBeenCalledWith(
      "",
      null,
      setMovies,
      setMoviesLoading,
      1,
      expect.any(Function),
      expect.any(Function),
    );
  });
});
