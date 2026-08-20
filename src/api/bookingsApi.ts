import type { SeatMap, SeatSetter } from "../types/booking";
import { UnauthorizedError } from "./errors";

async function requestTakenSeats(screeningId: number): Promise<SeatMap> {
  const response = await fetch(`/api/bookings/${screeningId}`);
  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function fetchTakenSeats(
  screeningId: number,
  setTakenSeats: SeatSetter,
  setTakenSeatsLoading: (loading: boolean) => void,
): Promise<SeatMap> {
  setTakenSeatsLoading(true);
  try {
    const takenSeats = await requestTakenSeats(screeningId);
    setTakenSeats(takenSeats);

    return takenSeats; // Return the fetched taken seats for further use
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error; // Rethrow the UnauthorizedError to be handled by the caller
    }
    console.error("Error fetching taken seats:", error);
    throw new Error("Failed to load taken seats.", { cause: error });
  } finally {
    setTakenSeatsLoading(false);
  }
}

export async function confirmReservation(
  screeningId: number,
  selectedSeats: SeatMap,
  setSelectedSeats: SeatSetter,
  setTakenSeats: SeatSetter,
  setReservationError: (error: string) => void,
): Promise<void> {
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        screeningId,
        seats: selectedSeats,
      }),
    });

    if (response.status === 401) {
      throw new UnauthorizedError();
    }

    if (response.status === 409) {
      const errorData = await response.json();

      // If there's a conflict, fetch the latest taken seats and update the state
      const latestTakenSeats = await requestTakenSeats(screeningId);
      setTakenSeats(latestTakenSeats);
      setSelectedSeats({});
      setReservationError(errorData.error);

      return;
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Update the taken seats state
    setTakenSeats((prevTakenSeats) => ({
      ...prevTakenSeats,
      ...selectedSeats,
    }));

    // Clear the selected seats after booking
    setSelectedSeats({});
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    setReservationError(
      error instanceof Error
        ? error.message
        : "An error occurred while confirming the reservation.",
    );
  }
}
