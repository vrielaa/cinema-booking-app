import { useLocation } from "@tanstack/react-router";
import { useEffect, useState, useOptimistic } from "react";
import {
  fetchMovie,
  fetchRoom,
  fetchScreeningFromScreeningId,
  fetchTakenSeats,
} from "../utils/fetchFunctions";
import type { Movie } from "../types/movie";
import type { Screening } from "../types/screening";
import type { SeatMap } from "../types/booking";

const seatPrice = 10;

export default function useBooking(screeningId: string) {
  const screeningFromState = useLocation({
    select: (location) => location.state?.screening,
  });

  const [screening, setScreening] = useState<Screening | null>(
    screeningFromState ?? null,
  );
  const [screeningLoading, setScreeningLoading] = useState(!screeningFromState);

  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [movieLoading, setMovieLoading] = useState(true);

  const [rowLabels, setRowLabels] = useState<string[] | undefined>(undefined);
  const [seatNumbers, setSeatNumbers] = useState<number[] | undefined>(
    undefined,
  );
  const [roomLoading, setRoomLoading] = useState(true);

  const [selectedSeats, setSelectedSeats] = useState<SeatMap>({});
  const [takenSeats, setTakenSeats] = useState<SeatMap>({});
  const [takenSeatsLoading, setTakenSeatsLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");

  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState("");

  const [optimisticTakenSeats, addOptimisticTakenSeats] = useOptimistic<
    SeatMap,
    SeatMap
  >(takenSeats, (currentTakenSeats, newTakenSeats) => ({
    ...currentTakenSeats,
    ...newTakenSeats,
  }));

  const selectedSeatsCount = Object.keys(selectedSeats).length;
  const isAnySeatSelected = selectedSeatsCount > 0;
  const cost = selectedSeatsCount * seatPrice;
  const bookingLoading =
    screeningLoading || movieLoading || roomLoading || takenSeatsLoading;

  useEffect(() => {
    function getScreeningFromLocation(
      screeningFromState: Screening,
    ): Screening {
      setScreening(screeningFromState);
      setScreeningLoading(false);

      return screeningFromState;
    }

    async function getScreeningFromFetch(): Promise<Screening> {
      return fetchScreeningFromScreeningId(
        screeningId,
        setScreening,
        setScreeningLoading,
      );
    }

    async function loadBooking() {
      setBookingError("");
      setScreeningLoading(true);
      setRoomLoading(true);
      setMovieLoading(true);
      setTakenSeatsLoading(true);

      try {
        const stateMatchesUrl =
          screeningFromState &&
          String(screeningFromState.id) === String(screeningId);

        let screeningData: Screening;

        if (stateMatchesUrl) {
          screeningData = getScreeningFromLocation(screeningFromState);
        } else {
          screeningData = await getScreeningFromFetch();
        }

        await Promise.all([
          fetchRoom(
            screeningData.room_id,
            setRowLabels,
            setSeatNumbers,
            setRoomLoading,
          ),
          fetchMovie(screeningData.movie_id, setMovie, setMovieLoading),
          fetchTakenSeats(
            screeningData.id,
            setTakenSeats,
            setTakenSeatsLoading,
          ),
        ]);
      } catch (error: unknown) {
        setScreeningLoading(false);
        setRoomLoading(false);
        setMovieLoading(false);
        setTakenSeatsLoading(false);
        setBookingError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      }
    }

    loadBooking();
  }, [screeningId, screeningFromState]);

  return {
    bookingError,
    bookingLoading,
    reservationError,
    setReservationError,
    reservationLoading,
    setReservationLoading,
    cost,
    isAnySeatSelected,
    movie,
    rowLabels,
    screening,
    seatNumbers,
    selectedSeats,
    setSelectedSeats,
    setTakenSeats,
    optimisticTakenSeats,
    addOptimisticTakenSeats,
    takenSeats,
  };
}
