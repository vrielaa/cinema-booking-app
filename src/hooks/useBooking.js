import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  fetchMovie,
  fetchRoom,
  fetchScreeningFromScreeningId,
  fetchTakenSeats,
} from "../utils/fetchFunctions";

const seatPrice = 10;

export default function useBooking(screeningId) {
  const screeningFromState = useLocation({
    select: (location) => location.state?.screening,
  });

  const [screening, setScreening] = useState(screeningFromState ?? null);
  const [screeningLoading, setScreeningLoading] = useState(!screeningFromState);

  const [movie, setMovie] = useState(undefined);
  const [movieLoading, setMovieLoading] = useState(true);

  const [rowLabels, setRowLabels] = useState(undefined);
  const [seatNumbers, setSeatNumbers] = useState(undefined);
  const [roomLoading, setRoomLoading] = useState(true);

  const [selectedSeats, setSelectedSeats] = useState({});
  const [takenSeats, setTakenSeats] = useState({});
  const [takenSeatsLoading, setTakenSeatsLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");

  const selectedSeatsCount = Object.keys(selectedSeats).length;
  const isAnySeatSelected = selectedSeatsCount > 0;
  const cost = selectedSeatsCount * seatPrice;
  const bookingLoading =
    screeningLoading || movieLoading || roomLoading || takenSeatsLoading;

  useEffect(() => {
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

        let screeningData;

        if (stateMatchesUrl) {
          screeningData = screeningFromState;
          setScreening(screeningData);
          setScreeningLoading(false);
        } else {
          screeningData = await fetchScreeningFromScreeningId(
            screeningId,
            setScreening,
            setScreeningLoading,
          );
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
      } catch (error) {
        setScreeningLoading(false);
        setRoomLoading(false);
        setMovieLoading(false);
        setTakenSeatsLoading(false);
        setBookingError(error.message);
      }
    }

    loadBooking();
  }, [screeningId, screeningFromState]);

  return {
    bookingError,
    bookingLoading,
    cost,
    isAnySeatSelected,
    movie,
    rowLabels,
    screening,
    seatNumbers,
    selectedSeats,
    setSelectedSeats,
    setTakenSeats,
    takenSeats,
  };
}
