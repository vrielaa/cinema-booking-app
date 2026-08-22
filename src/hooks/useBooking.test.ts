import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import useBooking from "./useBooking";
import { UnauthorizedError } from "../api/errors";

import type { Screening } from "../types/screening";
import {
  fetchMovie,
  fetchRoom,
  fetchScreeningFromScreeningId,
  fetchTakenSeats,
} from "../api";
import type { Room } from "../types/room";
import type { Movie } from "../types/movie";
import { useAuth } from "../context/AuthContext";

/* Mock the useLocation hook from @tanstack/react-router
 - vi.hoisted is used to hoist the mock implementation
 !to the top of the file,
 so that it is available before the useBooking hook is imported and used.
 */
const { useLocationMock, navigateMock } = vi.hoisted(() => ({
  useLocationMock: vi.fn<(...args: unknown[]) => Screening | undefined>(),
  navigateMock: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useLocation: useLocationMock,
  useNavigate: () => navigateMock,
}));

vi.mock("../api", () => ({
  fetchMovie: vi.fn(),
  fetchRoom: vi.fn(),
  fetchScreeningFromScreeningId: vi.fn(),
  fetchTakenSeats: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const setIsAuthenticatedMock = vi.fn();
const useAuthMock = vi.mocked(useAuth);
const fetchMovieMock = vi.mocked(fetchMovie);
const fetchRoomMock = vi.mocked(fetchRoom);
const fetchScreeningFromScreeningIdMock = vi.mocked(
  fetchScreeningFromScreeningId,
);
const fetchTakenSeatsMock = vi.mocked(fetchTakenSeats);

const screening: Screening = {
  id: 1,
  movie_id: 1,
  room_id: 1,
  screening_date: "2023-01-01",
  screening_time: "12:00",
  row_count: 5,
  seats_per_row: 5,
  movie_title: "Test Movie",
};

const movie: Movie = {
  id: 1,
  title: "Test Movie",
  genres: [{ id: 28, name: "Action" }],
  poster_path: "/path/to/poster.jpg",
  description: "Test movie description",
};

const room: Room = {
  id: 1,
  row_count: 5,
  seats_per_row: 5,
};

function mockSuccessfulBookingDetailsFetches(
  fromLocation: boolean = false,
  movieData: Movie = movie,
  roomData: Room = room,
  screeningData: Screening = screening,
) {
  fetchRoomMock.mockImplementationOnce(
    async (_roomId, setRowLabels, setSeatNumbers, setRoomLoading) => {
      setRowLabels(["A", "B", "C", "D", "E"]);
      setSeatNumbers([1, 2, 3, 4, 5]);
      setRoomLoading(false);

      return roomData;
    },
  );

  fetchMovieMock.mockImplementationOnce(
    async (_movieId, setMovie, setMovieLoading) => {
      setMovie(movieData);
      setMovieLoading(false);
    },
  );

  fetchTakenSeatsMock.mockImplementationOnce(
    async (_screeningId, setTakenSeats, setTakenSeatsLoading) => {
      const takenSeats = {
        B2: true,
      };

      setTakenSeats(takenSeats);
      setTakenSeatsLoading(false);

      return takenSeats;
    },
  );

  if (!fromLocation) {
    fetchScreeningFromScreeningIdMock.mockImplementationOnce(
      async (_screeningId, setScreening, setScreeningLoading) => {
        setScreening(screeningData);
        setScreeningLoading(false);

        return screeningData;
      },
    );
  }
}

describe("useBooking", () => {
  beforeEach(() => {
    useLocationMock.mockReset();
    fetchMovieMock.mockReset();
    fetchRoomMock.mockReset();
    fetchScreeningFromScreeningIdMock.mockReset();
    fetchTakenSeatsMock.mockReset();
    navigateMock.mockReset();
    setIsAuthenticatedMock.mockReset();

    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      setIsAuthenticated: setIsAuthenticatedMock,
      isLoading: false,
    });
  });

  it("should have correct initial state before loading data", () => {
    useLocationMock.mockReturnValue(undefined);
    fetchScreeningFromScreeningIdMock.mockReturnValueOnce(
      new Promise<Screening>(() => {}),
    );

    const { result } = renderHook(() => useBooking("1"));
    //booking loading shoud be true
    expect(result.current.bookingLoading).toBe(true);
    //selectedseats is empty
    expect(result.current.selectedSeats).toEqual({});
    expect(result.current.cost).toBe(0);
    //isAnySeatSelected should be false
    expect(result.current.isAnySeatSelected).toBe(false);
    //booking error and reservation error should be empty
    expect(result.current.bookingError).toBe("");
    expect(result.current.reservationError).toBe("");
    //reservation loading should be false
    expect(result.current.reservationLoading).toBe(false);
  });

  it("should have screening passed in location state and not call fetchScreeningFromScreeningId", () => {
    useLocationMock.mockReturnValue(screening);
    const { result } = renderHook(() => useBooking(screening.id.toString()));
    //booking loading should be true initially
    expect(result.current.bookingLoading).toBe(true);
    //assert that screening screening in state is consistent with screeningId
    expect(result.current.screening?.id).toBe(screening.id);
    //assert that fetchScreeningFromScreeningId is not called
    expect(fetchScreeningFromScreeningIdMock).not.toHaveBeenCalled();
    //room movie and taken seats should be fetched
    expect(fetchMovieMock).toHaveBeenCalled();
    expect(fetchRoomMock).toHaveBeenCalled();
    expect(fetchTakenSeatsMock).toHaveBeenCalled();
    //correct arguments should be passed to fetch functions
    expect(fetchMovieMock).toHaveBeenCalledWith(
      screening.movie_id,
      expect.any(Function),
      expect.any(Function),
    );
    expect(fetchRoomMock).toHaveBeenCalledWith(
      screening.room_id,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    );
    expect(fetchTakenSeatsMock).toHaveBeenCalledWith(
      screening.id,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("should finish loading booking data and set bookingLoading to false after fetching data -- location", async () => {
    mockSuccessfulBookingDetailsFetches(true);
    useLocationMock.mockReturnValue(screening);
    const { result } = renderHook(() => useBooking("1"));

    await waitFor(() => {
      expect(result.current.bookingLoading).toBe(false);
    });

    expect(fetchScreeningFromScreeningIdMock).not.toHaveBeenCalled();
    expect(fetchMovieMock).toHaveBeenCalledWith(
      screening.movie_id,
      expect.any(Function),
      expect.any(Function),
    );
    expect(fetchRoomMock).toHaveBeenCalledWith(
      screening.room_id,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    );
    expect(fetchTakenSeatsMock).toHaveBeenCalledWith(
      screening.id,
      expect.any(Function),
      expect.any(Function),
    );

    expect(result.current.screening).toEqual(screening);
    expect(result.current.movie).toEqual(movie);
    expect(result.current.rowLabels).toEqual(["A", "B", "C", "D", "E"]);
    expect(result.current.seatNumbers).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.takenSeats).toEqual({ B2: true });
    expect(result.current.optimisticTakenSeats).toEqual({ B2: true });
  });

  it("should finish loading booking data and set bookingLoading to false after fetching data -- fetch", async () => {
    mockSuccessfulBookingDetailsFetches();
    useLocationMock.mockReturnValue(undefined);
    const { result } = renderHook(() => useBooking("1"));

    await waitFor(() => {
      expect(result.current.bookingLoading).toBe(false);
    });

    expect(fetchScreeningFromScreeningIdMock).toHaveBeenCalledWith(
      "1",
      expect.any(Function),
      expect.any(Function),
    );

    expect(fetchMovieMock).toHaveBeenCalledWith(
      screening.movie_id,
      expect.any(Function),
      expect.any(Function),
    );
    expect(fetchRoomMock).toHaveBeenCalledWith(
      screening.room_id,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    );
    expect(fetchTakenSeatsMock).toHaveBeenCalledWith(
      screening.id,
      expect.any(Function),
      expect.any(Function),
    );

    expect(result.current.screening).toEqual(screening);
    expect(result.current.movie).toEqual(movie);
    expect(result.current.rowLabels).toEqual(["A", "B", "C", "D", "E"]);
    expect(result.current.seatNumbers).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.takenSeats).toEqual({ B2: true });
    expect(result.current.optimisticTakenSeats).toEqual({ B2: true });
  });

  it("should fetch the URL screening when location state does not match", async () => {
    const differentScreeningFromState: Screening = {
      id: 2,
      movie_id: 2,
      room_id: 2,
      screening_date: "2023-01-02",
      screening_time: "14:00",
      row_count: 6,
      seats_per_row: 6,
      movie_title: "Different Movie",
    };

    useLocationMock.mockReturnValue(differentScreeningFromState);
    mockSuccessfulBookingDetailsFetches();

    const { result } = renderHook(() => useBooking("1")); //user passed "1" as screeningId in the URL, but location state has a different screening with id 2

    await waitFor(() => {
      expect(result.current.bookingLoading).toBe(false);
    });

    expect(fetchScreeningFromScreeningIdMock).toHaveBeenCalledWith(
      "1",
      expect.any(Function),
      expect.any(Function),
    );

    expect(fetchMovieMock).toHaveBeenCalledWith(
      screening.movie_id,
      expect.any(Function),
      expect.any(Function),
    );

    expect(fetchRoomMock).toHaveBeenCalledWith(
      screening.room_id,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    );

    expect(fetchTakenSeatsMock).toHaveBeenCalledWith(
      screening.id,
      expect.any(Function),
      expect.any(Function),
    );

    expect(result.current.screening).toEqual(screening);
    expect(result.current.screening).not.toEqual(differentScreeningFromState);
  });

  describe("selected seats logic --  when:", () => {
    beforeEach(() => {
      useLocationMock.mockReturnValue(screening);
      mockSuccessfulBookingDetailsFetches(true);
    });

    it("none selected -- should have isAnySeatSelected false, selectedSeatsCount 0, cost 0", async () => {
      const { result } = renderHook(() => useBooking("1"));

      await waitFor(() => {
        expect(result.current.bookingLoading).toBe(false);
      });
      expect(result.current.isAnySeatSelected).toBe(false);
      expect(Object.keys(result.current.selectedSeats)).toHaveLength(0);
      expect(result.current.cost).toBe(0);
      expect(result.current.selectedSeats).toEqual({});
    });

    it("one selected -- should have isAnySeatSelected true, selectedSeatsCount > 0, cost: 10", async () => {
      const { result } = renderHook(() => useBooking("1"));

      await waitFor(() => {
        expect(result.current.bookingLoading).toBe(false);
      });

      act(() => {
        result.current.setSelectedSeats({ A1: true });
      });

      expect(result.current.isAnySeatSelected).toBe(true);
      expect(Object.keys(result.current.selectedSeats)).toHaveLength(1);
      expect(result.current.cost).toBe(10);
      expect(result.current.selectedSeats).toEqual({ A1: true });
    });

    it("three selected -- should have isAnySeatSelected true, selectedSeatsCount > 0, cost: 30", async () => {
      const { result } = renderHook(() => useBooking("1"));

      await waitFor(() => {
        expect(result.current.bookingLoading).toBe(false);
      });

      act(() => {
        result.current.setSelectedSeats({ A1: true, A2: true, A3: true });
      });

      expect(result.current.isAnySeatSelected).toBe(true);
      expect(Object.keys(result.current.selectedSeats)).toHaveLength(3);
      expect(result.current.cost).toBe(30);
      expect(result.current.selectedSeats).toEqual({
        A1: true,
        A2: true,
        A3: true,
      });
    });

    it("update selected seats -- should update selectedSeats, isAnySeatSelected, selectedSeatsCount, and cost accordingly", async () => {
      const { result } = renderHook(() => useBooking("1"));

      await waitFor(() => {
        expect(result.current.bookingLoading).toBe(false);
      });

      act(() => {
        result.current.setSelectedSeats({ A1: true, A2: true });
      });

      expect(result.current.isAnySeatSelected).toBe(true);
      expect(Object.keys(result.current.selectedSeats)).toHaveLength(2);
      expect(result.current.cost).toBe(20);
      expect(result.current.selectedSeats).toEqual({ A1: true, A2: true });

      act(() => {
        result.current.setSelectedSeats({ A1: true, A3: true });
      });

      expect(result.current.isAnySeatSelected).toBe(true);
      expect(Object.keys(result.current.selectedSeats)).toHaveLength(2);
      expect(result.current.cost).toBe(20);
      expect(result.current.selectedSeats).toEqual({ A1: true, A3: true });

      act(() => {
        result.current.setSelectedSeats({});
      });

      expect(result.current.isAnySeatSelected).toBe(false);
      expect(Object.keys(result.current.selectedSeats)).toHaveLength(0);
      expect(result.current.cost).toBe(0);
      expect(result.current.selectedSeats).toEqual({});
    });
  });

  describe("error handling -- when:", () => {
    it("fetchScreeningFromScreeningId fails -- should set bookingError and bookingLoading to false", async () => {
      useLocationMock.mockReturnValue(undefined);

      fetchScreeningFromScreeningIdMock.mockRejectedValueOnce(
        new Error("Failed to fetch screening"),
      );

      const { result } = renderHook(() => useBooking("1"));

      await waitFor(() => {
        expect(result.current.bookingError).toBe("Failed to fetch screening");
      });

      expect(result.current.bookingLoading).toBe(false);
    });

    it("fetchMovie fails -- should set bookingError and bookingLoading to false", async () => {
      useLocationMock.mockReturnValue(screening);
      fetchMovieMock.mockRejectedValueOnce(new Error("Failed to fetch movie"));

      const { result } = renderHook(() => useBooking("1"));

      await waitFor(() => {
        expect(result.current.bookingError).toBe("Failed to fetch movie");
      });

      expect(result.current.bookingLoading).toBe(false);
    });

    it("fetchRoom fails -- should set bookingError and bookingLoading to false", async () => {
      useLocationMock.mockReturnValue(screening);
      fetchRoomMock.mockRejectedValueOnce(new Error("Failed to fetch room"));

      const { result } = renderHook(() => useBooking("1"));

      await waitFor(() => {
        expect(result.current.bookingError).toBe("Failed to fetch room");
      });

      expect(result.current.bookingLoading).toBe(false);
    });

    it("fetchTakenSeats fails -- should set bookingError and bookingLoading to false", async () => {
      useLocationMock.mockReturnValue(screening);
      fetchTakenSeatsMock.mockRejectedValueOnce(
        new Error("Failed to fetch taken seats"),
      );

      const { result } = renderHook(() => useBooking("1"));

      await waitFor(() => {
        expect(result.current.bookingError).toBe("Failed to fetch taken seats");
      });

      expect(result.current.bookingLoading).toBe(false);
    });
  });

  it("loads new booking data when screeningId changes", async () => {
    const secondScreening: Screening = {
      id: 2,
      movie_id: 2,
      room_id: 2,
      screening_date: "2023-01-02",
      screening_time: "14:00",
      row_count: 6,
      seats_per_row: 6,
      movie_title: "Second Movie",
    };

    const secondMovie: Movie = {
      id: 2,
      title: "Second Movie",
      genres: [{ id: 35, name: "Comedy" }],
      poster_path: "/path/to/second_poster.jpg",
      description: "Second movie description",
    };

    const secondRoom: Room = {
      id: 2,
      row_count: 6,
      seats_per_row: 6,
    };

    useLocationMock.mockReturnValue(undefined);
    mockSuccessfulBookingDetailsFetches();

    const { result, rerender } = renderHook(
      ({ screeningId }) => useBooking(screeningId),
      {
        initialProps: { screeningId: screening.id.toString() },
      },
    );

    await waitFor(() => {
      expect(result.current.bookingLoading).toBe(false);
    });

    expect(fetchScreeningFromScreeningIdMock).toHaveBeenCalledWith(
      "1",
      expect.any(Function),
      expect.any(Function),
    );

    // Change the screeningId prop to trigger a new fetch
    mockSuccessfulBookingDetailsFetches(
      false,
      secondMovie,
      secondRoom,
      secondScreening,
    );
    rerender({ screeningId: "2" });

    await waitFor(() => {
      expect(result.current.bookingLoading).toBe(false);
    });

    expect(fetchScreeningFromScreeningIdMock).toHaveBeenCalledWith(
      "2",
      expect.any(Function),
      expect.any(Function),
    );

    expect(result.current.screening).toEqual(secondScreening);
  });

  it("should throw UnauthorizedError during booking if user is not authenticated and handleBookingError should navigate to login page", async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      setIsAuthenticated: setIsAuthenticatedMock,
      isLoading: false,
    });

    useLocationMock.mockReturnValue(screening);
    mockSuccessfulBookingDetailsFetches(true);

    fetchTakenSeatsMock.mockReset();
    fetchTakenSeatsMock.mockRejectedValueOnce(new UnauthorizedError());

    renderHook(() => useBooking("1"));

    await waitFor(() => {
      expect(setIsAuthenticatedMock).toHaveBeenCalledWith(false);
    });

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/login",
      search: {
        redirect: `/booking/1`,
      },
    });
  });
});
