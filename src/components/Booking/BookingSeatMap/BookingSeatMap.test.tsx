import { beforeEach, describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingSeatMap from "./BookingSeatMap";
import type { SeatSetter } from "../../../types/booking";
import userEvent from "@testing-library/user-event";

describe("BookingSeatMap", () => {
  const rowLabels = ["A", "B", "C", "D", "E"];
  const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const setSelectedSeats = vi.fn<SeatSetter>();
  let selectedSeats = {};
  let takenSeats = { B1: true, C2: true };

  function renderBookingSeatMap() {
    render(
      <BookingSeatMap
        rowLabels={rowLabels}
        seatNumbers={seatNumbers}
        setSelectedSeats={setSelectedSeats}
        selectedSeats={selectedSeats}
        takenSeats={takenSeats}
      />,
    );
  }

  beforeEach(() => {
    takenSeats = { B1: true, C2: true };
    selectedSeats = {};
  });

  it("should render the seat map correctly", () => {
    renderBookingSeatMap();

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(rowLabels.length * seatNumbers.length); //50
  });

  it("should render taken seats correctly", () => {
    renderBookingSeatMap();

    const takenSeatB1 = screen.getByRole("button", {
      name: "B1, taken",
    });
    const takenSeatC2 = screen.getByRole("button", {
      name: "C2, taken",
    });

    expect(takenSeatB1).toBeInTheDocument();
    expect(takenSeatB1).toBeDisabled();
    expect(takenSeatB1).toHaveClass("booking-seat-taken");

    expect(takenSeatC2).toBeInTheDocument();
    expect(takenSeatC2).toBeDisabled();
    expect(takenSeatC2).toHaveClass("booking-seat-taken");
  });

  it("should render selected seats correctly", () => {
    selectedSeats = { A1: true, D5: true };

    renderBookingSeatMap();

    const selectedSeatA1 = screen.getByRole("button", {
      name: "A1, selected",
    });
    const selectedSeatD5 = screen.getByRole("button", {
      name: "D5, selected",
    });

    expect(selectedSeatA1).toBeInTheDocument();
    expect(selectedSeatA1).not.toBeDisabled();
    expect(selectedSeatA1).toHaveClass("booking-seat-selected");

    expect(selectedSeatD5).toBeInTheDocument();
    expect(selectedSeatD5).not.toBeDisabled();
    expect(selectedSeatD5).toHaveClass("booking-seat-selected");
  });

  it("should render available seats correctly", () => {
    renderBookingSeatMap();

    const availableSeatA1 = screen.getByRole("button", {
      name: "A1, available",
    });

    expect(availableSeatA1).toBeInTheDocument();
    expect(availableSeatA1).not.toBeDisabled();
    expect(availableSeatA1).toHaveClass("booking-seat-available");
  });

  it("should call setSelectedSeats when an available seat is clicked", async () => {
    const user = userEvent.setup();
    renderBookingSeatMap();

    const availableSeatA1 = screen.getByRole("button", {
      name: "A1, available",
    });

    await user.click(availableSeatA1);

    expect(setSelectedSeats).toHaveBeenCalledOnce();
  });

  it("should not call setSelectedSeats when a taken seat is clicked", async () => {
    const user = userEvent.setup();
    renderBookingSeatMap();

    const takenSeatB1 = screen.getByRole("button", {
      name: "B1, taken",
    });

    await user.click(takenSeatB1);

    expect(setSelectedSeats).not.toHaveBeenCalled();
  });

  it("should call setSelectedSeats when a selected seat is clicked", async () => {
    const user = userEvent.setup();
    selectedSeats = { A1: true };
    renderBookingSeatMap();

    const selectedSeatA1 = screen.getByRole("button", {
      name: "A1, selected",
    });

    await user.click(selectedSeatA1);

    expect(setSelectedSeats).toHaveBeenCalled();
  });
  it("should render the last seat", () => {
    renderBookingSeatMap();

    expect(
      screen.getByRole("button", {
        name: "E10, available",
      }),
    ).toBeInTheDocument();
  });
});
