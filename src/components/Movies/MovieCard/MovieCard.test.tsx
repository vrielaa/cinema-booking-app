import { render, screen } from "@testing-library/react";
import { expect, it, vi, describe } from "vitest";
import userEvent from "@testing-library/user-event";
import MovieCard from "./MovieCard";
import type { Movie } from "../../../types/movie";

const movie: Movie = {
  id: 1,
  title: "Test Movie",
  genre: "Action",
  description: "Test description",
  duration_minutes: 125,
  poster_path: "https://example.com/poster.jpg",
};

describe("MovieCard", () => {
  it("should display the correct movie title, genre, duration and poster", () => {
    //arrangement
    render(<MovieCard movie={movie} selectMovie={vi.fn()} />);

    //no actions, just assertions

    //assertions

    //is movie title rendered
    expect(
      screen.getByRole("heading", { name: "Test Movie" }),
    ).toBeInTheDocument();

    //is movie genre and duration rendered
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Duration: 2h 5m")).toBeInTheDocument();

    //is movie poster rendered with correct src
    expect(screen.getByRole("img", { name: "Test Movie" })).toHaveAttribute(
      "src",
      movie.poster_path,
    );

    //is alt text of the poster correct
    expect(screen.getByRole("img", { name: "Test Movie" })).toHaveAttribute(
      "alt",
      movie.title,
    );
  });

  it("should call selectMovie when the movie card is clicked", async () => {
    const selectMovie = vi.fn();
    const user = userEvent.setup();
    render(<MovieCard movie={movie} selectMovie={selectMovie} />);

    await user.click(screen.getByRole("button", { name: /Test Movie/ }));

    expect(selectMovie).toHaveBeenCalledOnce();
  });
});
