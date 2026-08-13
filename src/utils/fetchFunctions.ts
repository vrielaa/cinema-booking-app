//* Movie requests

import type { SeatMap, SeatSetter } from "../types/booking";
import type { Movie } from "../types/movie";
import type { Room } from "../types/room";
import type {
  Screening,
  ScreeningSetter,
  ScreeningsSetter,
} from "../types/screening";

export async function fetchMovies(
  setMovies: (movies: Movie[]) => void,
  setMoviesLoading: (loading: boolean) => void,
): Promise<void> {
  setMoviesLoading(true);

  try {
    const response = await fetch("/api/movies");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Movie[] = await response.json();
    setMovies(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    setMoviesLoading(false);
  }
}

export async function fetchMovie(
  movieId: number,
  setMovie: (movie: Movie) => void,
  setMovieLoading: (loading: boolean) => void,
): Promise<void> {
  setMovieLoading(true);
  try {
    const response = await fetch(`/api/movies/${movieId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Movie = await response.json();
    setMovie(data);
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw new Error("Failed to load movie.", { cause: error });
  } finally {
    setMovieLoading(false);
  }
}

export async function searchMovies(
  title: string,
  genre: string,
  minDuration: number | "",
  maxDuration: number | "",
  setMovies: (movies: Movie[]) => void,
  setMoviesLoading: (loading: boolean) => void,
): Promise<void> {
  setMoviesLoading(true);

  try {
    const response = await fetch(
      `/api/movies/search?title=${encodeURIComponent(title)}&genre=${encodeURIComponent(genre)}&minDuration=${encodeURIComponent(String(minDuration))}&maxDuration=${encodeURIComponent(String(maxDuration))}`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Movie[] = await response.json();
    setMovies(data);
  } catch (error) {
    console.error("Error searching movies:", error);
  } finally {
    setMoviesLoading(false);
  }
}

export async function fetchGenres(
  setGenres: (genres: string[]) => void,
  setGenresLoading: (loading: boolean) => void,
): Promise<void> {
  setGenresLoading(true);

  try {
    const response = await fetch("/api/movies/genres");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: string[] = await response.json();
    setGenres(data);
  } catch (error) {
    console.error("Error fetching genres:", error);
  } finally {
    setGenresLoading(false);
  }
}

//* Screening requests

export async function fetchScreeningsForMovie(
  movieId: number,
  setScreenings: ScreeningsSetter,
  setScreeningsLoading: (loading: boolean) => void,
): Promise<void> {
  setScreeningsLoading(true);

  try {
    const response = await fetch(`/api/screenings/${movieId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Screening[] = await response.json();
    setScreenings(data);
  } catch (error) {
    console.error("Error fetching screenings:", error);
  } finally {
    setScreeningsLoading(false);
  }
}

export async function fetchScreeningFromScreeningId(
  screeningId: string,
  setScreening: ScreeningSetter,
  setScreeningLoading: (loading: boolean) => void,
): Promise<Screening> {
  setScreeningLoading(true);
  try {
    const response = await fetch(`/api/screenings/screening/${screeningId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Screening = await response.json();
    setScreening(data);

    return data; // Return the fetched screening data for further use
  } catch (error) {
    console.error("Error fetching screening:", error);
    throw new Error("Failed to load screening.", { cause: error });
  } finally {
    setScreeningLoading(false);
  }
}

async function requestTakenSeats(screeningId: number): Promise<SeatMap> {
  const response = await fetch(`/api/bookings/${screeningId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

//* Room requests

export async function fetchRoom(
  roomId: number,
  setRowLabels: (labels: string[]) => void,
  setSeatNumbers: (numbers: number[]) => void,
  setRoomLoading: (loading: boolean) => void,
): Promise<Room> {
  setRoomLoading(true);
  try {
    const response = await fetch(`/api/rooms/${roomId}`);
    if (!response.ok) {
      throw new Error("Failed to load room.");
    }

    const data: Room = await response.json();

    const rowLabels = Array.from({ length: data.row_count }, (_, index) =>
      String.fromCharCode(65 + index),
    );

    const seatNumbers = Array.from(
      { length: data.seats_per_row },
      (_, index) => index + 1,
    );

    setRowLabels(rowLabels);
    setSeatNumbers(seatNumbers);

    return data; // Return the fetched room data for further use
  } catch (error) {
    console.error("Error fetching room info:", error);
    throw new Error("Failed to load room.", { cause: error });
  } finally {
    setRoomLoading(false);
  }
}

//* Booking requests

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
    console.error("Error fetching taken seats:", error);
    throw new Error("Failed to load taken seats.", { cause: error });
  } finally {
    setTakenSeatsLoading(false);
  }
}

export async function confirmReservation(
  screeningId: number,
  customerName: string,
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
        customerName,
        seats: selectedSeats,
      }),
    });

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
    setReservationError(
      error instanceof Error
        ? error.message
        : "An error occurred while confirming the reservation.",
    );
  }
}
