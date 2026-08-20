import { describe, vi, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingSummary from "./BookingSummary";
import type { SeatMap, SeatSetter } from "../../../types/booking";
import type { Screening } from "../../../types/screening";
import userEvent from "@testing-library/user-event";

describe("BookingSummary", () => {
  const setSelectedSeats: SeatSetter = vi.fn();
  const setTakenSeats: SeatSetter = vi.fn();
  const addOptimisticTakenSeats = vi.fn();
  const setReservationLoading = vi.fn();
  const setReservationError = vi.fn();
  const handleBookingError = vi.fn();

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

  function renderBookingSummary({
    selectedSeats = {},
    cost = 0,
  }: {
    selectedSeats?: SeatMap;
    cost?: number;
  } = {}) {
    const isAnySeatSelected = Object.keys(selectedSeats).length > 0;

    return render(
      <BookingSummary
        isAnySeatSelected={isAnySeatSelected}
        selectedSeats={selectedSeats}
        cost={cost}
        screening={screening}
        setSelectedSeats={setSelectedSeats}
        setTakenSeats={setTakenSeats}
        addOptimisticTakenSeats={addOptimisticTakenSeats}
        setReservationLoading={setReservationLoading}
        setReservationError={setReservationError}
        handleBookingError={handleBookingError}
      />,
    );
  }

  it("should render the booking summary correctly", () => {
    renderBookingSummary();

    const yourSeatsLabel = screen.getByText("Your seats");
    const totalLabel = screen.getByText("Total");
    const reserveButton = screen.getByRole("button", {
      name: "Reserve seats",
    });

    expect(yourSeatsLabel).toBeInTheDocument();
    expect(totalLabel).toBeInTheDocument();
    expect(reserveButton).toBeInTheDocument();
  });

  it("should display 'None selected' when no seats are selected", () => {
    renderBookingSummary();

    const yourSeatsValue = screen.getByText("None selected");
    expect(yourSeatsValue).toBeInTheDocument();
  });

  it("should display the total cost correctly when none seats are selected", () => {
    renderBookingSummary();

    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("should display the total cost correctly when seats are selected", () => {
    const selectedSeats = { A1: true, B2: true };
    const cost = 20; // Assuming each seat costs $10
    renderBookingSummary({ cost, selectedSeats });

    expect(screen.getByText("A1, B2")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
  });

  it("should disable the reserve button when no seats are selected", () => {
    renderBookingSummary();

    const reserveButton = screen.getByRole("button", {
      name: "Reserve seats",
    });
    expect(reserveButton).toBeDisabled();
  });

  it("should enable the reserve button when seats are selected", () => {
    const selectedSeats = { A1: true };
    renderBookingSummary({ selectedSeats });

    const reserveButton = screen.getByRole("button", {
      name: "Reserve seats",
    });
    expect(reserveButton).toBeEnabled();
  });

  it("should open reservation modal after clicking reserve button", async () => {
    const modalRoot = document.createElement("div");
    modalRoot.id = "modal";
    document.body.appendChild(modalRoot);

    const user = userEvent.setup();

    renderBookingSummary({
      selectedSeats: {
        A1: true,
      },
      cost: 10,
    });

    await user.click(
      screen.getByRole("button", {
        name: "Reserve seats",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Confirm Reservation",
      }),
    ).toBeInTheDocument();

    modalRoot.remove();
  });
});
