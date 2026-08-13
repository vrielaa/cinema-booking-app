import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingReserveModal from "./BookingReserveModal";
import type { SeatMap, SeatSetter } from "../../../types/booking";
import type { Screening } from "../../../types/screening";
import userEvent from "@testing-library/user-event";
import { confirmReservation } from "../../../api";

vi.mock("../../../api", () => ({
  confirmReservation: vi.fn(),
}));

describe("BookingReserveModal", () => {
  const setSelectedSeats: SeatSetter = vi.fn();
  const setTakenSeats: SeatSetter = vi.fn();
  const addOptimisticTakenSeats = vi.fn();
  const setReservationLoading = vi.fn();
  const setReservationError = vi.fn();
  const closeModal = vi.fn();

  const confirmReservationMock = vi.mocked(confirmReservation);

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

  function renderBookingReserveModal({
    selectedSeats = {},
  }: {
    selectedSeats?: SeatMap;
  } = {}) {
    return render(
      <BookingReserveModal
        screening={screening}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        setTakenSeats={setTakenSeats}
        addOptimisticTakenSeats={addOptimisticTakenSeats}
        setReservationLoading={setReservationLoading}
        setReservationError={setReservationError}
        closeModal={closeModal}
      />,
    );
  }

  beforeEach(() => {
    const modalRoot = document.createElement("div");
    modalRoot.id = "modal";
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    document.getElementById("modal")?.remove();
  });

  it("should render the modal with correct information", () => {
    renderBookingReserveModal({ selectedSeats: { A1: true, B2: true } });

    expect(
      screen.getByRole("heading", { name: "Confirm Reservation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Movie:")).toBeInTheDocument();
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("Date:")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("Time:")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01T19:00:00Z")).toBeInTheDocument();
    expect(screen.getByText("Room:")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Seats:")).toBeInTheDocument();
    expect(screen.getByText("A1, B2")).toBeInTheDocument();
  });

  it("should call closeModal when the close button is clicked", async () => {
    const user = userEvent.setup();
    renderBookingReserveModal({ selectedSeats: { A1: true } });
    const closeButton = screen.getByRole("button", { name: "Close modal" });
    await user.click(closeButton);
    expect(closeModal).toHaveBeenCalled();
  });

  it("should keep confirm button disabled when no seats are selected", async () => {
    const user = userEvent.setup();

    renderBookingReserveModal({
      selectedSeats: {},
    });

    await user.type(screen.getByPlaceholderText("Enter your name"), "John Doe");

    expect(
      screen.getByRole("button", {
        name: "Confirm Reservation",
      }),
    ).toBeDisabled();
  });

  it("should keep confirm button disabled when name contains only spaces", async () => {
    const user = userEvent.setup();

    renderBookingReserveModal({
      selectedSeats: {
        A1: true,
      },
    });

    await user.type(screen.getByPlaceholderText("Enter your name"), "   ");

    expect(
      screen.getByRole("button", {
        name: "Confirm Reservation",
      }),
    ).toBeDisabled();
  });

  it("should disable confirm button when user name is not provided and seats are selected", () => {
    renderBookingReserveModal({ selectedSeats: { A1: true } });

    const confirmButton = screen.getByRole("button", {
      name: "Confirm Reservation",
    });
    expect(confirmButton).toBeDisabled();
  });

  it("should enable confirm button when user name is provided and seats are selected", async () => {
    const user = userEvent.setup();
    renderBookingReserveModal({ selectedSeats: { A1: true } });

    const confirmButton = screen.getByRole("button", {
      name: "Confirm Reservation",
    });
    expect(confirmButton).toBeDisabled();
    const nameInput = screen.getByPlaceholderText("Enter your name");
    await user.type(nameInput, "John Doe");

    expect(confirmButton).toBeEnabled();
  });

  it("should call reserveSeats and closeModal when confirm button is clicked with valid input", async () => {
    const user = userEvent.setup();
    renderBookingReserveModal({ selectedSeats: { A1: true } });

    const nameInput = screen.getByPlaceholderText("Enter your name");
    await user.type(nameInput, "John Doe");

    const confirmButton = screen.getByRole("button", {
      name: "Confirm Reservation",
    });
    await user.click(confirmButton);

    expect(confirmReservationMock).toHaveBeenCalledWith(
      screening.id,
      "John Doe",
      {
        A1: true,
      },
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );
    expect(setReservationLoading).toHaveBeenNthCalledWith(1, true);
    expect(setReservationLoading).toHaveBeenNthCalledWith(2, false);
    expect(addOptimisticTakenSeats).toHaveBeenCalledWith({ A1: true });
    expect(closeModal).toHaveBeenCalled();
  });
});
