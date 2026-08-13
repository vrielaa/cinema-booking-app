import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import type { Room } from "../types/room";
import type { Screening } from "../types/screening";
import {
  fetchMovie,
  fetchRoom,
  fetchScreeningFromScreeningId,
  fetchTakenSeats,
  confirmReservation,
  fetchMovies,
  searchMovies,
  fetchGenres,
  fetchScreeningsForMovie,
} from "./fetchFunctions";
import type { Movie } from "../types/movie";
import type { SeatMap } from "../types/booking";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function createJsonResponse<T>(
  data: T,
  status = 200,
  statusText = "",
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => data,
  } as Response;
}

//ROOM
const room: Room = {
  id: 1,
  row_count: 3,
  seats_per_row: 5,
};

const setRowLabels = vi.fn();
const setSeatNumbers = vi.fn();
const setRoomLoading = vi.fn();

const rowLabels = ["A", "B", "C"];
const seatNumbers = [1, 2, 3, 4, 5];

//SCREENING

const setScreening = vi.fn();
const setScreeningLoading = vi.fn();

const screening: Screening = {
  id: 1,
  movie_id: 1,
  room_id: 1,
  screening_date: "2023-10-01",
  screening_time: "18:00",
  row_count: 3,
  seats_per_row: 5,
  movie_title: "Test Movie",
};

//MOVIE
const setMovie = vi.fn();
const setMovieLoading = vi.fn();

const movie: Movie = {
  id: 1,
  title: "Test Movie",
  genre: "Action",
  duration_minutes: 120,
  description: "A test movie for unit testing.",
  poster_path: "/path/to/poster.jpg",
};

//MOVIES

const setMovies = vi.fn();
const setMoviesLoading = vi.fn();

const moviesResponse: Movie[] = [
  {
    id: 1,
    title: "Test Movie 1",
    genre: "Action",
    duration_minutes: 120,
    description: "A test movie for unit testing.",
    poster_path: "/path/to/poster1.jpg",
  },
  {
    id: 2,
    title: "Test Movie 2",
    genre: "Comedy",
    duration_minutes: 90,
    description: "Another test movie for unit testing.",
    poster_path: "/path/to/poster2.jpg",
  },
];

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

describe("fetchRoom", () => {
  it("should request the room from /api/rooms/1", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(room));

    await fetchRoom(1, setRowLabels, setSeatNumbers, setRoomLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/rooms/1");
  });

  it("should set loading to true before the request and false after it finishes", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(room));

    await fetchRoom(1, setRowLabels, setSeatNumbers, setRoomLoading);

    expect(setRoomLoading).toHaveBeenCalledTimes(2);
    expect(setRoomLoading).toHaveBeenNthCalledWith(1, true);
    expect(setRoomLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should create row labels and seat numbers from the fetched room", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(room));

    await fetchRoom(1, setRowLabels, setSeatNumbers, setRoomLoading);

    expect(setRowLabels).toHaveBeenCalledWith(rowLabels);
    expect(setSeatNumbers).toHaveBeenCalledWith(seatNumbers);
  });

  it("should return the fetched room", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(room));

    const result = await fetchRoom(
      1,
      setRowLabels,
      setSeatNumbers,
      setRoomLoading,
    );

    expect(result).toEqual(room);
  });

  it("should throw and avoid updating room data when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await expect(
      fetchRoom(1, setRowLabels, setSeatNumbers, setRoomLoading),
    ).rejects.toThrow("Failed to load room.");

    expect(setRoomLoading).toHaveBeenCalledTimes(2);
    expect(setRowLabels).not.toHaveBeenCalled();
    expect(setSeatNumbers).not.toHaveBeenCalled();
    expect(setRoomLoading).toHaveBeenNthCalledWith(1, true);
    expect(setRoomLoading).toHaveBeenNthCalledWith(2, false);
  });
});

describe("fetchMovie", () => {
  it("should request the movie from /api/movies/1", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(movie));

    await fetchMovie(1, setMovie, setMovieLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/movies/1");
  });

  it("should store the movie and finish loading after a successful response", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(movie));

    await fetchMovie(1, setMovie, setMovieLoading);

    expect(setMovieLoading).toHaveBeenCalledTimes(2);
    expect(setMovieLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMovieLoading).toHaveBeenNthCalledWith(2, false);
    expect(setMovie).toHaveBeenCalledWith(movie);
  });

  it("should throw and avoid updating the movie when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await expect(fetchMovie(1, setMovie, setMovieLoading)).rejects.toThrow(
      "Failed to load movie.",
    );

    expect(setMovieLoading).toHaveBeenCalledTimes(2);
    expect(setMovieLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMovieLoading).toHaveBeenNthCalledWith(2, false);
    expect(setMovie).not.toHaveBeenCalled();
  });
});

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

describe("fetchScreeningFromScreeningId", () => {
  it("should request the screening from /api/screenings/screening/1", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(screening));

    await fetchScreeningFromScreeningId("1", setScreening, setScreeningLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/screenings/screening/1");
  });

  it("should store and return the screening after a successful response", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(screening));

    const result = await fetchScreeningFromScreeningId(
      "1",
      setScreening,
      setScreeningLoading,
    );

    expect(setScreeningLoading).toHaveBeenCalledTimes(2);
    expect(setScreeningLoading).toHaveBeenNthCalledWith(1, true);
    expect(setScreeningLoading).toHaveBeenNthCalledWith(2, false);
    expect(setScreening).toHaveBeenCalledWith(screening);
    expect(result).toEqual(screening);
  });

  it("should throw and avoid updating the screening when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await expect(
      fetchScreeningFromScreeningId("1", setScreening, setScreeningLoading),
    ).rejects.toThrow("Failed to load screening.");

    expect(setScreeningLoading).toHaveBeenCalledTimes(2);
    expect(setScreeningLoading).toHaveBeenNthCalledWith(1, true);
    expect(setScreeningLoading).toHaveBeenNthCalledWith(2, false);
    expect(setScreening).not.toHaveBeenCalled();
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

describe("fetchMovies", () => {
  it("should fetch movies, store them, and finish loading", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(moviesResponse));

    await fetchMovies(setMovies, setMoviesLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/movies");
    expect(setMovies).toHaveBeenCalledWith(moviesResponse);
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when the response is not ok", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await fetchMovies(setMovies, setMoviesLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching movies:",
      expect.objectContaining({
        message: "Network response was not ok",
      }),
    );

    expect(setMovies).not.toHaveBeenCalled();
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when fetch rejects", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockRejectedValueOnce(new Error("Unexpected error"));

    await fetchMovies(setMovies, setMoviesLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching movies:",
      expect.objectContaining({
        message: "Unexpected error",
      }),
    );
  });
});

describe("searchMovies", () => {
  it("should request movies using the provided search parameters", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(moviesResponse));

    await searchMovies("Test", "Action", 90, 150, setMovies, setMoviesLoading);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/movies/search?title=Test&genre=Action&minDuration=90&maxDuration=150",
    );
    expect(setMovies).toHaveBeenCalledWith(moviesResponse);
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should encode search parameters to handle special characters", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(moviesResponse));

    await searchMovies(
      "Test Movie",
      "Action & Adventure",
      90,
      150,
      setMovies,
      setMoviesLoading,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/movies/search?title=Test%20Movie&genre=Action%20%26%20Adventure&minDuration=90&maxDuration=150",
    );
    expect(setMovies).toHaveBeenCalledWith(moviesResponse);
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should include empty duration parameters in the request", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(moviesResponse));

    await searchMovies("Test", "Action", "", "", setMovies, setMoviesLoading);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/movies/search?title=Test&genre=Action&minDuration=&maxDuration=",
    );
    expect(setMovies).toHaveBeenCalledWith(moviesResponse);
    expect(setMoviesLoading).toHaveBeenCalledTimes(2);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when the response is not ok", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await searchMovies("Test", "Action", 90, 150, setMovies, setMoviesLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error searching movies:",
      expect.objectContaining({
        message: "Network response was not ok",
      }),
    );

    expect(setMovies).not.toHaveBeenCalled();
    expect(setMoviesLoading).toHaveBeenNthCalledWith(1, true);
    expect(setMoviesLoading).toHaveBeenNthCalledWith(2, false);
  });
});

describe("fetchGenres", () => {
  it("should fetch genres, store them, and finish loading", async () => {
    const genresResponse = ["Action", "Comedy", "Drama"];
    const okGenresResponse = {
      ok: true,
      json: async () => genresResponse,
    } as Response;

    fetchMock.mockResolvedValueOnce(okGenresResponse);

    const setGenres = vi.fn();
    const setGenresLoading = vi.fn();

    await fetchGenres(setGenres, setGenresLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/movies/genres");
    expect(setGenres).toHaveBeenCalledWith(genresResponse);
    expect(setGenresLoading).toHaveBeenCalledTimes(2);
    expect(setGenresLoading).toHaveBeenNthCalledWith(1, true);
    expect(setGenresLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when the response is not ok", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const errorGenresResponse = {
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as Response;

    fetchMock.mockResolvedValueOnce(errorGenresResponse);

    const setGenres = vi.fn();
    const setGenresLoading = vi.fn();

    await fetchGenres(setGenres, setGenresLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching genres:",
      expect.objectContaining({
        message: "Network response was not ok",
      }),
    );

    expect(setGenres).not.toHaveBeenCalled();
    expect(setGenresLoading).toHaveBeenNthCalledWith(1, true);
    expect(setGenresLoading).toHaveBeenNthCalledWith(2, false);
  });
});

describe("fetchScreeningsForMovie", () => {
  it("should fetch screenings for a movie, store them, and finish loading", async () => {
    const screeningsResponse: Screening[] = [
      {
        id: 1,
        movie_id: 1,
        room_id: 1,
        screening_date: "2023-10-01",
        screening_time: "18:00",
        row_count: 3,
        seats_per_row: 5,
        movie_title: "Test Movie",
      },
      {
        id: 2,
        movie_id: 1,
        room_id: 2,
        screening_date: "2023-10-02",
        screening_time: "20:00",
        row_count: 4,
        seats_per_row: 6,
        movie_title: "Test Movie",
      },
    ];

    const okScreeningsResponse = {
      ok: true,
      json: async () => screeningsResponse,
    } as Response;

    fetchMock.mockResolvedValueOnce(okScreeningsResponse);

    const setScreenings = vi.fn();
    const setScreeningsLoading = vi.fn();

    await fetchScreeningsForMovie(1, setScreenings, setScreeningsLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/screenings/1");
    expect(setScreenings).toHaveBeenCalledWith(screeningsResponse);
    expect(setScreeningsLoading).toHaveBeenCalledTimes(2);
    expect(setScreeningsLoading).toHaveBeenNthCalledWith(1, true);
    expect(setScreeningsLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when the response is not ok", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const errorScreeningsResponse = {
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as Response;

    fetchMock.mockResolvedValueOnce(errorScreeningsResponse);

    const setScreenings = vi.fn();
    const setScreeningsLoading = vi.fn();

    await fetchScreeningsForMovie(1, setScreenings, setScreeningsLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching screenings:",
      expect.objectContaining({
        message: "Network response was not ok",
      }),
    );
    expect(setScreenings).not.toHaveBeenCalled();
    expect(setScreeningsLoading).toHaveBeenNthCalledWith(1, true);
    expect(setScreeningsLoading).toHaveBeenNthCalledWith(2, false);
  });
});
