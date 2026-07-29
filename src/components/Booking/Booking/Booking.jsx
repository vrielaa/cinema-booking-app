import "./booking.scss";
import { useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import BookingSeatMap from "../BookingSeatMap/BookingSeatMap";
import BookingMovieCard from "../BookingMovieCard/BookingMovieCard";
import BookingLegend from "../BookingLegend/BookingLegend";
import BookingHeading from "../BookingHeading/BookingHeading";
import BookingSummary from "../BookingSummary/BookingSummary";
import {
  fetchMovie,
  fetchRoom,
  fetchScreeningFromScreeningId,
  fetchTakenSeats,
} from "../../../utils/fetchFunctions";

export default function Booking({ screeningId }) {
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
  const seatPrice = 10; // Assuming each seat costs $10
  const isAnySeatSelected = Object.keys(selectedSeats).length > 0;
  const cost = Object.keys(selectedSeats).length * seatPrice;
  const bookingLoading =
    screeningLoading || movieLoading || roomLoading || takenSeatsLoading;
  const [bookingError, setBookingError] = useState("");

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

  if (bookingLoading) {
    return (
      <section className="booking-loading" role="status" aria-live="polite">
        <div className="booking-loading-spinner" aria-hidden="true"></div>
        <p className="booking-loading-text">Loading booking...</p>
      </section>
    );
  }

  if (bookingError) {
    return (
      <section className="booking-error" role="alert">
        <p className="booking-error-message">{bookingError}</p>
      </section>
    );
  }

  return (
    <section className="booking-page">
      <BookingHeading />

      <div className="booking-layout">
        <BookingMovieCard
          src={movie?.poster_path}
          title={movie?.title}
          genre={movie?.genre}
          date={screening?.screening_date}
          time={screening?.screening_time}
          roomId={screening?.room_id}
        />
        <div className="booking-seats-card">
          <div className="booking-screen-area">
            <div className="booking-screen"></div>
            <p className="booking-screen-label">Screen</p>
          </div>

          <BookingSeatMap
            rowLabels={rowLabels}
            seatNumbers={seatNumbers}
            setSelectedSeats={setSelectedSeats}
            selectedSeats={selectedSeats}
            takenSeats={takenSeats}
          />

          <BookingLegend />

          <BookingSummary
            isAnySeatSelected={isAnySeatSelected}
            selectedSeats={selectedSeats}
            cost={cost}
            movie={movie}
            screening={screening}
            setSelectedSeats={setSelectedSeats}
            setTakenSeats={setTakenSeats}
          />
        </div>
      </div>
    </section>
  );
}
