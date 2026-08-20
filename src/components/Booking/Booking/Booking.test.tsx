import useBooking from "../../../hooks/useBooking";
import { describe, vi, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Booking from "./Booking";
import type { Movie } from "../../../types/movie";
import type { Screening } from "../../../types/screening";

vi.mock("../../../hooks/useBooking", () => ({
  default: vi.fn(),
}));

const useBookingMock = vi.mocked(useBooking);

describe("Booking component", () => {
  const movie: Movie = {
    id: 1,
    title: "Test Movie",
    description: "A test movie description.",
    genre: "Action",
    duration_minutes: 120,
    poster_path: "/path/to/poster.jpg",
  };

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

  const bookingData = {
    bookingError: "",
    bookingLoading: false,
    reservationError: "",
    setReservationError: vi.fn(),
    reservationLoading: false,
    setReservationLoading: vi.fn(),
    cost: 10,
    isAnySeatSelected: true,
    movie,
    rowLabels: ["A", "B"],
    screening,
    seatNumbers: [1, 2],
    selectedSeats: { A1: true },
    setSelectedSeats: vi.fn(),
    setTakenSeats: vi.fn(),
    optimisticTakenSeats: { B2: true },
    addOptimisticTakenSeats: vi.fn(),
    takenSeats: { B2: true },
    handleBookingError: vi.fn(),
  };

  it("should pass screeningId to useBooking hook", () => {
    const screeningId = "1";
    useBookingMock.mockReturnValue(bookingData);

    render(<Booking screeningId={screeningId} />);

    expect(useBookingMock).toHaveBeenCalledWith(screeningId);
  });

  it("should render loading state when bookingLoading is true", () => {
    useBookingMock.mockReturnValue({ ...bookingData, bookingLoading: true });

    render(<Booking screeningId="1" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading booking...")).toBeInTheDocument();
  });

  it("should render error state when bookingError is present", () => {
    useBookingMock.mockReturnValue({
      ...bookingData,
      bookingError: "An error occurred",
    });

    render(<Booking screeningId="1" />);

    expect(screen.getByRole("alert")).toHaveTextContent("An error occurred");
  });

  it("should handle incomplete booking data gracefully", () => {
    useBookingMock.mockReturnValue({
      ...bookingData,
      screening: null,
    });

    render(<Booking screeningId="1" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Booking data is incomplete. Please try again later.",
    );
  });

  it("should render Booking components when booking data is complete", () => {
    useBookingMock.mockReturnValue(bookingData);

    render(<Booking screeningId="1" />);
    //header
    expect(
      screen.getByRole("heading", { name: "Choose your seats" }),
    ).toBeInTheDocument();
    //seats
    expect(
      screen.getByRole("button", { name: "A1, selected" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "B2, taken" }),
    ).toBeInTheDocument();
    //summary
    expect(screen.getByText("Your seats")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    //reserve button
    expect(
      screen.getByRole("button", { name: "Reserve seats" }),
    ).toBeInTheDocument();
    //movie card
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Test Movie",
      }),
    ).toBeInTheDocument();
    //movie poster
    expect(
      screen.getByRole("img", {
        name: "Test Movie",
      }),
    ).toHaveAttribute("src", "/path/to/poster.jpg");
    //movie description
    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });
  //legend
  it("should render the legend correctly", () => {
    useBookingMock.mockReturnValue(bookingData);

    render(<Booking screeningId="1" />);

    const availableLegend = screen.getByText("Available");
    const selectedLegend = screen.getByText("Selected");
    const takenLegend = screen.getByText("Taken");

    expect(availableLegend).toBeInTheDocument();
    expect(selectedLegend).toBeInTheDocument();
    expect(takenLegend).toBeInTheDocument();
  });

  it("should handle optimistic seat reservation correctly, without hiding seat map", () => {
    useBookingMock.mockReturnValue({
      ...bookingData,
      reservationLoading: true,
    });

    render(<Booking screeningId="1" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Reserving seats...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "B2, taken" }),
    ).toBeInTheDocument();
  });

  it("should display reservation error correctly", () => {
    useBookingMock.mockReturnValue({
      ...bookingData,
      reservationError: "Reservation failed",
    });

    render(<Booking screeningId="1" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Reservation failed");

    expect(
      screen.getByRole("button", {
        name: "A1, selected",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "B2, taken",
      }),
    ).toBeInTheDocument();
  });
});
