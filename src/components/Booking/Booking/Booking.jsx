import "./booking.scss";
import { useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import BookingSeatMap from "../BookingSeatMap/BookingSeatMap";
import BookingMovieCard from "../BookingMovieCard/BookingMovieCard";
import BookingReserveModal from "../BookingReserveModal/BookingReserveModal";
import {
  fetchMovie,
  fetchRoom,
  fetchScreeningRoomMovieTakenSeats,
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const stateMatchesUrl =
      screeningFromState &&
      String(screeningFromState.id) === String(screeningId);

    if (stateMatchesUrl) {
      setScreening(screeningFromState);
      setScreeningLoading(false);

      setRoomLoading(true);
      fetchRoom(
        screeningFromState.room_id,
        setRowLabels,
        setSeatNumbers,
        setRoomLoading,
      );
      fetchMovie(screeningFromState.movie_id, setMovie, setMovieLoading);
      fetchTakenSeats(
        screeningFromState.id,
        setTakenSeats,
        setTakenSeatsLoading,
      );

      return; // Exit early if the state matches the URL
    }

    fetchScreeningRoomMovieTakenSeats(
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
    );
  }, [screeningId, screeningFromState]);

  if (bookingLoading) {
    return (
      <section className="booking-loading" role="status" aria-live="polite">
        <div className="booking-loading-spinner" aria-hidden="true"></div>
        <p className="booking-loading-text">Loading booking...</p>
      </section>
    );
  }

  return (
    <section className="booking-page">
      <div className="booking-heading">
        <p className="booking-eyebrow">Seat reservation</p>
        <h1 className="booking-title">Choose your seats</h1>
        <p className="booking-intro">
          Select the perfect place and enjoy the show.
        </p>
      </div>

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

          <div className="booking-legend">
            <div className="booking-legend-item">
              <span className="booking-legend-seat booking-legend-available"></span>
              <span className="booking-legend-label">Available</span>
            </div>
            <div className="booking-legend-item">
              <span className="booking-legend-seat booking-legend-taken"></span>
              <span className="booking-legend-label">Taken</span>
            </div>
            <div className="booking-legend-item">
              <span className="booking-legend-seat booking-legend-selected"></span>
              <span className="booking-legend-label">Selected</span>
            </div>
          </div>

          <div className="booking-summary">
            <div className="booking-summary-copy">
              <span className="booking-summary-label">Your seats</span>
              <strong className="booking-summary-value">
                {isAnySeatSelected
                  ? Object.keys(selectedSeats).join(", ")
                  : "None selected"}
              </strong>
            </div>
            <div className="booking-summary-total">
              <span className="booking-summary-label">Total</span>
              <strong className="booking-price">${cost.toFixed(2)}</strong>
            </div>
            <button
              className="booking-confirm-button"
              type="button"
              disabled={!isAnySeatSelected || takenSeatsLoading}
              onClick={() => setIsModalOpen(true)}
            >
              Reserve seats
            </button>

            {isModalOpen ? (
              <BookingReserveModal
                screeningId={screeningId}
                title={movie?.title}
                date={screening?.screening_date}
                time={screening?.screening_time}
                roomId={screening?.room_id}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                setTakenSeats={setTakenSeats}
                close={() => setIsModalOpen(false)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
