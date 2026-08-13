import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Movie } from "../../../types/movie";
import ScreeningsMovieInfo from "./ScreeningsMovieInfo";

const movie: Movie = {
  id: 1,
  title: "Test Movie",
  genre: "Drama",
  description: "A test movie description.",
  duration_minutes: 125,
  poster_path: "https://example.com/test-movie.jpg",
};

describe("ScreeningsMovieInfo", () => {
  it("should display the movie information", () => {
    render(<ScreeningsMovieInfo movie={movie} />);

    expect(
      screen.getByRole("heading", { level: 1, name: movie.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("Duration: 2h 5m")).toBeInTheDocument();
    expect(screen.getByText(movie.genre)).toBeInTheDocument();
    expect(screen.getByText(movie.description!)).toBeInTheDocument();

    expect(screen.getByRole("img", { name: movie.title })).toHaveAttribute(
      "src",
      movie.poster_path,
    );
  });
});
