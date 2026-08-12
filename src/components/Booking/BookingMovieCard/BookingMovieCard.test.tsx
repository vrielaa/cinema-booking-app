import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingMovieCard from "./BookingMovieCard";
import type { Screening } from "../../../types/screening";

describe("BookingMovieCard", () => {
  const screening: Screening = {
    id: 1,
    movie_id: 1,
    room_id: 1,
    screening_date: "2023-01-01",
    screening_time: "2023-01-01T19:00:00Z",
    row_count: 5,
    seats_per_row: 10,
    movie_title: "Test Movie",
  };

  const movie = {
    id: 1,
    title: "Test Movie",
    genre: "Action",
    description: "This is a test movie description.",
    duration_minutes: 120,
    poster_path: "/test-poster.jpg",
  };

  function renderBookingMovieCard() {
    return render(<BookingMovieCard movie={movie} screening={screening} />);
  }

  it("should render the booking movie card correctly", () => {
    renderBookingMovieCard();

    const poster = screen.getByAltText("Test Movie");
    const title = screen.getByText("Test Movie");
    const genre = screen.getByText("Action");
    const date = screen.getByText("2023-01-01");
    const time = screen.getByText("2023-01-01T19:00:00Z");
    const room = screen.getByText("Room 1");

    expect(poster).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(genre).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(room).toBeInTheDocument();
  });

  it("should display movie poster with correct src and alt attributes", () => {
    renderBookingMovieCard();

    const poster = screen.getByRole("img", {
      name: "Test Movie",
    });

    expect(poster).toHaveAttribute("src", "/test-poster.jpg");
    expect(poster).toHaveAttribute("alt", "Test Movie");
  });
});
