import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SeatMap } from "../types/booking";
import createJsonResponse from "../test/createJsonResponse";
import { confirmReservation, fetchTakenSeats } from "./bookingsApi";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// TAKEN SEATS
const setTakenSeats = vi.fn();
const setTakenSeatsLoading = vi.fn();
const takenSeatsResult: SeatMap = {
  A1: true,
  A2: true,
  B3: true,
};

// RESERVATION
const screeningId = 1;
const customerName = "John Doe";
const selectedSeats: SeatMap = { A1: true, B1: true };
const setSelectedSeats = vi.fn();
const setReservationError = vi.fn();

describe("fetchTakenSeats", () => {
  it("should request taken seats from /api/bookings/1", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(takenSeatsResult));

    await fetchTakenSeats(1, setTakenSeats, setTakenSeatsLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/bookings/1");
  });

  it("should store and return taken seats after a successful response", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(takenSeatsResult));

    const result = await fetchTakenSeats(
      1,
      setTakenSeats,
      setTakenSeatsLoading,
    );

    expect(setTakenSeatsLoading).toHaveBeenCalledTimes(2);
    expect(setTakenSeatsLoading).toHaveBeenNthCalledWith(1, true);
    expect(setTakenSeatsLoading).toHaveBeenNthCalledWith(2, false);
    expect(setTakenSeats).toHaveBeenCalledWith(takenSeatsResult);
    expect(result).toEqual(takenSeatsResult);
  });

  it("should throw and avoid updating taken seats when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await expect(
      fetchTakenSeats(1, setTakenSeats, setTakenSeatsLoading),
    ).rejects.toThrow("Failed to load taken seats.");

    expect(setTakenSeatsLoading).toHaveBeenCalledTimes(2);
    expect(setTakenSeatsLoading).toHaveBeenNthCalledWith(1, true);
    expect(setTakenSeatsLoading).toHaveBeenNthCalledWith(2, false);
    expect(setTakenSeats).not.toHaveBeenCalled();
  });
});

describe("confirmReservation", () => {
  it("should post the reservation to /api/bookings with the correct payload", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, 200));

    await confirmReservation(
      screeningId,
      customerName,
      selectedSeats,
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );

    expect(fetchMock).toHaveBeenCalledWith("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        screeningId,
        customerName,
        seats: selectedSeats,
      }),
    });
  });

  it("should update taken and selected seats after a successful response", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, 200));

    await confirmReservation(
      screeningId,
      customerName,
      selectedSeats,
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );

    expect(setTakenSeats).toHaveBeenCalled();
    expect(setSelectedSeats).toHaveBeenCalled();
  });

  it("should preserve previously taken seats when adding reserved seats", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, 200));

    const previouslyTakenSeats: SeatMap = { C1: true };
    const newSelectedSeats: SeatMap = { A1: true, B1: true };

    await confirmReservation(
      screeningId,
      customerName,
      newSelectedSeats,
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );

    const updateTakenSeats = setTakenSeats.mock.calls[0][0];

    //   console.log("setTakenSeats  :", setTakenSeats.toString());
    //   console.log("setTakenSeats mock :", setTakenSeats.mock);
    //   console.log("setTakenSeats mock calls :", setTakenSeats.mock.calls);
    //   console.log("setTakenSeats mock calls[0] :", setTakenSeats.mock.calls[0]);
    //   console.log(
    //     "setTakenSeats mock calls[0][0] :",
    //     setTakenSeats.mock.calls[0][0].toString(),
    //   );

    if (typeof updateTakenSeats !== "function") {
      throw new Error("Expected a state updater function");
    }

    expect(updateTakenSeats(previouslyTakenSeats)).toEqual({
      A1: true,
      B1: true,
      C1: true,
    });
  });

  it("should clear selected seats after a successful reservation", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, 200));

    await confirmReservation(
      screeningId,
      customerName,
      selectedSeats,
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );

    expect(setSelectedSeats).toHaveBeenCalledWith({});
  });

  it("should not set an error after a successful reservation", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({}, 200));

    await confirmReservation(
      screeningId,
      customerName,
      selectedSeats,
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );

    expect(setReservationError).not.toHaveBeenCalled();
  });

  it("should refresh taken seats and report an error after a 409 conflict", async () => {
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({ error: "Some seats are already taken." }, 409),
      )
      .mockResolvedValueOnce(createJsonResponse(takenSeatsResult));

    await confirmReservation(
      screeningId,
      customerName,
      selectedSeats,
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        screeningId,
        customerName,
        seats: selectedSeats,
      }),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/bookings/1");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(setSelectedSeats).toHaveBeenCalledWith({});
    expect(setTakenSeats).toHaveBeenCalledWith(takenSeatsResult);
    expect(setReservationError).toHaveBeenCalledWith(
      "Some seats are already taken.",
    );
  });

  it("should report an error when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse(null, 500, "Internal Server Error"),
    );

    await confirmReservation(
      screeningId,
      customerName,
      selectedSeats,
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );

    expect(setReservationError).toHaveBeenCalledWith(
      "Network response was not ok",
    );
    expect(setSelectedSeats).not.toHaveBeenCalled();
    expect(setTakenSeats).not.toHaveBeenCalled();
  });

  it("should report a fallback message when fetch rejects with a non-Error value", async () => {
    fetchMock.mockRejectedValueOnce("Unexpected error");

    await confirmReservation(
      screeningId,
      customerName,
      selectedSeats,
      setSelectedSeats,
      setTakenSeats,
      setReservationError,
    );

    expect(setReservationError).toHaveBeenCalledWith(
      "An error occurred while confirming the reservation.",
    );
    expect(setSelectedSeats).not.toHaveBeenCalled();
    expect(setTakenSeats).not.toHaveBeenCalled();
  });
});
