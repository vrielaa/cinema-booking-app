export async function fetchRoom(
  roomId,
  setRowLabels,
  setSeatNumbers,
  setRoomLoading,
) {
  setRoomLoading(true);
  try {
    const response = await fetch(`/api/rooms/${roomId}`);
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
  } finally {
    setRoomLoading(false);
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
  } finally {
    setMovieLoading(false);
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
  } finally {
    setScreeningLoading(false);
  }
}

export async function fetchScreeningRoomMovieTakenSeats(
  screeningId,
  setScreening,
  setScreeningLoading,
  setRowLabels,
  setSeatNumbers,
  setRoomLoading,
  setMovie,
  setMovieLoading,
  setTakenSeats,
  setTakenSeatsLoading,
) {
  setScreeningLoading(true);
  setRoomLoading(true);
  setMovieLoading(true);
  setTakenSeatsLoading(true);

  try {
    let roomResponse = null;
    let takenSeatsResponse = null;

    const screeningResponse = await fetchScreeningFromScreeningId(
      screeningId,
      setScreening,
      setScreeningLoading,
    );
    if (screeningResponse) {
      const roomId = screeningResponse.room_id;
      roomResponse = await fetchRoom(
        roomId,
        setRowLabels,
        setSeatNumbers,
        setRoomLoading,
      );

      takenSeatsResponse = await fetchTakenSeats(
        screeningId,
        setTakenSeats,
        setTakenSeatsLoading,
      );
    }

    if (screeningResponse && roomResponse) {
      const movieId = screeningResponse.movie_id;
      const movieResponse = await fetch(`/api/movies/${movieId}`);
      if (!movieResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const movieData = await movieResponse.json();
      setMovie(movieData);
    }
  } catch (error) {
    console.error("Error fetching screening and room:", error);
  } finally {
    setScreeningLoading(false);
    setRoomLoading(false);
    setMovieLoading(false);
    setTakenSeatsLoading(false);
  }
}

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

export async function confirmReservation(
  screeningId,
  customerName,
  selectedSeats,
  setSelectedSeats,
  close,
  setTakenSeats,
) {
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

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Booking successful:", data);

    // Update the taken seats state
    setTakenSeats((prevTakenSeats) => ({
      ...prevTakenSeats,
      ...selectedSeats,
    }));

    // Clear the selected seats after booking
    setSelectedSeats({});
    close();
  } catch (error) {
    console.error("Error booking seats:", error);
  }
}

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
  } finally {
    setTakenSeatsLoading(false);
  }
}
