//* Movie requests

export async function fetchMovies(setMovies, setMoviesLoading) {
  setMoviesLoading(true);

  try {
    const response = await fetch("/api/movies");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setMovies(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    setMoviesLoading(false);
  }
}

export async function fetchMovie(movieId, setMovie, setMovieLoading) {
  setMovieLoading(true);
  try {
    const response = await fetch(`/api/movies/${movieId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setMovie(data);
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw new Error("Failed to load movie.");
  } finally {
    setMovieLoading(false);
  }
}

//* Screening requests

export async function fetchScreeningsForMovie(
  movieId,
  setScreenings,
  setScreeningsLoading,
) {
  setScreeningsLoading(true);

  try {
    const response = await fetch(`/api/screenings/${movieId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setScreenings(data);
  } catch (error) {
    console.error("Error fetching screenings:", error);
  } finally {
    setScreeningsLoading(false);
  }
}

export async function fetchScreeningFromScreeningId(
  screeningId,
  setScreening,
  setScreeningLoading,
) {
  setScreeningLoading(true);
  try {
    const response = await fetch(`/api/screenings/screening/${screeningId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setScreening(data);

    return data; // Return the fetched screening data for further use
  } catch (error) {
    console.error("Error fetching screening:", error);
    throw new Error("Failed to load screening.");
  } finally {
    setScreeningLoading(false);
  }
}

//* Room requests

export async function fetchRoom(
  roomId,
  setRowLabels,
  setSeatNumbers,
  setRoomLoading,
) {
  setRoomLoading(true);
  try {
    const response = await fetch(`/api/rooms/${roomId}`);
    if (!response.ok) {
      throw new Error("Failed to load room.");
    }

    const data = await response.json();

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
    throw new Error("Failed to load room.");
  } finally {
    setRoomLoading(false);
  }
}

//* Booking requests

export async function fetchTakenSeats(
  screeningId,
  setTakenSeats,
  setTakenSeatsLoading,
) {
  setTakenSeatsLoading(true);
  try {
    const response = await fetch(`/api/bookings/${screeningId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const takenSeats = await response.json();
    setTakenSeats(takenSeats);

    return takenSeats; // Return the fetched taken seats for further use
  } catch (error) {
    console.error("Error fetching taken seats:", error);
    throw new Error("Failed to load taken seats.");
  } finally {
    setTakenSeatsLoading(false);
  }
}

export async function confirmReservation(
  screeningId,
  customerName,
  selectedSeats,
  setSelectedSeats,
  close,
  setTakenSeats,
  setReservationLoading,
  setReservationError,
) {
  setReservationLoading(true);
  setReservationError("");

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

      await fetchTakenSeats(screeningId, setTakenSeats, setReservationLoading);
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
    close();
  } catch (error) {
    setReservationError(
      error.message || "An error occurred while confirming the reservation.",
    );
  } finally {
    setReservationLoading(false);
  }
}
