import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Movie } from "../../../types/movie";
import ScreeningsMovieInfo from "./ScreeningsMovieInfo";

const movie: Movie = {
  id: 1,
  title: "Test Movie",
  genres: [{ id: 18, name: "Drama" }],
  description: "A test movie description.",
  poster_path: "https://example.com/test-movie.jpg",
};

describe("ScreeningsMovieInfo", () => {
  it("should display the movie information", () => {
    render(<ScreeningsMovieInfo movie={movie} />);

    expect(
      screen.getByRole("heading", { level: 1, name: movie.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(movie.genres.map((genre) => genre.name).join(", ")),
    ).toBeInTheDocument();
    expect(screen.getByText(movie.description!)).toBeInTheDocument();

    expect(screen.getByRole("img", { name: movie.title })).toHaveAttribute(
      "src",
      movie.poster_path,
    );
  });
});
