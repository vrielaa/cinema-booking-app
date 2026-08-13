import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fetchGenres, searchMovies } from "../../../api";
import MovieFilters from "./MovieFilters";

vi.mock("../../../api", () => ({
  fetchGenres: vi.fn(),
  searchMovies: vi.fn(),
}));

const fetchGenresMock = vi.mocked(fetchGenres);
const searchMoviesMock = vi.mocked(searchMovies);

describe("MovieFilters", () => {
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
});
