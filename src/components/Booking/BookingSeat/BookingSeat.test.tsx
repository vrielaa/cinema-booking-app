import { it, describe, vi, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingSeat from "./BookingSeat";
import { type SeatSetter } from "../../../types/booking";

describe("BookingSeat", () => {
  const seatData = {
    rowLabel: "A",
    seatNumber: 1,
  };

  let selectedSeats = {};

  const takenSeats = {
    B1: true,
    C2: true,
  };
  const setSelectedSeats = vi.fn<SeatSetter>();

  const bookingSeat = (
    <BookingSeat
      rowLabel={seatData.rowLabel}
      seatNumber={seatData.seatNumber}
      selectedSeats={selectedSeats}
      setSelectedSeats={setSelectedSeats}
      takenSeats={takenSeats}
    />
  );

  beforeEach(() => {
    selectedSeats = {};
  });

  it("should render free seat correctly", () => {
    render(bookingSeat);

    const seatButton = screen.getByRole("button", {
      name: "A1, available",
    });

    expect(seatButton).toBeInTheDocument();
    expect(seatButton).not.toBeDisabled();

    expect(seatButton).toHaveClass("booking-seat-available");
  });

  it("should not call setSelectedSeats when clicked if seat is taken", async () => {
    const user = userEvent.setup();
    render(
      <BookingSeat
        rowLabel="B"
        seatNumber={1}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        takenSeats={takenSeats}
      />,
    );

    const seat = screen.getByRole("button", {
      name: "B1, taken",
    });

    expect(seat).toBeDisabled();

    await user.click(seat);

    expect(setSelectedSeats).not.toHaveBeenCalled();
  });

  it("should render selected seat correctly", () => {
    selectedSeats = {
      A1: true,
    };

    render(
      <BookingSeat
        rowLabel={seatData.rowLabel}
        seatNumber={seatData.seatNumber}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        takenSeats={takenSeats}
      />,
    );

    const seatButton = screen.getByRole("button", {
      name: "A1, selected",
    });

    expect(seatButton).toBeEnabled();
    expect(seatButton).toHaveClass("booking-seat-selected");
  });

  it("should add seat to selectedSeats when clicked if it was not selected", async () => {
    const user = userEvent.setup();

    render(bookingSeat);

    const seatButton = screen.getByRole("button", {
      name: "A1, available",
      pressed: false,
    });

    await user.click(seatButton);

    const updateSelectedSeats = setSelectedSeats.mock.calls[0][0];
    //mock.calls[0][0] is the first argument of the first call to setSelectedSeats, which is the updater function

    if (typeof updateSelectedSeats !== "function") {
      throw new Error("Expected a state updater function");
    }

    //check if updater function
    expect(updateSelectedSeats({})).toEqual({
      A1: true,
    });
  });

  it("should remove seat from selectedSeats when clicked if it was already selected", async () => {
    selectedSeats = {
      A1: true,
    };

    const user = userEvent.setup();

    render(
      <BookingSeat
        rowLabel={seatData.rowLabel}
        seatNumber={seatData.seatNumber}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        takenSeats={takenSeats}
      />,
    );

    const seatButton = screen.getByRole("button", {
      name: "A1, selected",
      pressed: true,
    });

    await user.click(seatButton);

    const updateSelectedSeats = setSelectedSeats.mock.calls[0][0];

    if (typeof updateSelectedSeats !== "function") {
      throw new Error("Expected a state updater function");
    }

    expect(updateSelectedSeats(selectedSeats)).toEqual({});
  });

  it("should treat taken seat as taken even if it is selected", () => {
    selectedSeats = {
      B1: true,
    };

    render(
      <BookingSeat
        rowLabel="B"
        seatNumber={1}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        takenSeats={takenSeats}
      />,
    );

    const seatButton = screen.getByRole("button", {
      name: "B1, taken",
      pressed: false,
    });

    expect(seatButton).toBeDisabled();
    expect(seatButton).toHaveClass("booking-seat-taken");
    expect(seatButton).not.toHaveClass("booking-seat-selected");
  });

  it("should preserve old seat selections when selecting a new seat", async () => {
    selectedSeats = {
      B2: true,
      C3: true,
    };

    const user = userEvent.setup();

    render(
      <BookingSeat
        rowLabel="A"
        seatNumber={1}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        takenSeats={takenSeats}
      />,
    );

    const seatButton = screen.getByRole("button", {
      name: "A1, available",
      pressed: false,
    });

    await user.click(seatButton);

    const updateSelectedSeats = setSelectedSeats.mock.calls[0][0];

    if (typeof updateSelectedSeats !== "function") {
      throw new Error("Expected a state updater function");
    }

    expect(updateSelectedSeats(selectedSeats)).toEqual({
      A1: true,
      B2: true,
      C3: true,
    });
  });
});
