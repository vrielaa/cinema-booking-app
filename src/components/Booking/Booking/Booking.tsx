import "./booking.scss";
import BookingSeatMap from "../BookingSeatMap/BookingSeatMap";
import BookingMovieCard from "../BookingMovieCard/BookingMovieCard";
import BookingLegend from "../BookingLegend/BookingLegend";
import BookingHeading from "../BookingHeading/BookingHeading";
import BookingSummary from "../BookingSummary/BookingSummary";
import useBooking from "../../../hooks/useBooking";

export default function Booking({ screeningId }: { screeningId: string }) {
  const {
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
  } = useBooking(screeningId);

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

  if (!screening || !movie || !rowLabels || !seatNumbers) {
    return (
      <section className="booking-error" role="alert">
        <p className="booking-error-message">
          Booking data is incomplete. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="booking-page">
      <BookingHeading />

      <div className="booking-layout">
        <BookingMovieCard movie={movie} screening={screening} />
        <div className="booking-seats-card">
          {reservationLoading ? (
            <div
              className="booking-reservation-loading-overlay"
              role="status"
              aria-live="polite"
            >
              <div
                className="booking-reservation-loading-spinner"
                aria-hidden="true"
              />
              <p className="booking-reservation-loading-text">
                Reserving seats...
              </p>
            </div>
          ) : null}

          {reservationError ? (
            <p className="booking-reservation-error" role="alert">
              {reservationError}
            </p>
          ) : null}

          <div className="booking-screen-area">
            <div className="booking-screen"></div>
            <p className="booking-screen-label">Screen</p>
          </div>

          <BookingSeatMap
            rowLabels={rowLabels}
            seatNumbers={seatNumbers}
            setSelectedSeats={setSelectedSeats}
            selectedSeats={selectedSeats}
            takenSeats={optimisticTakenSeats}
          />

          <BookingLegend />

          <BookingSummary
            isAnySeatSelected={isAnySeatSelected}
            selectedSeats={selectedSeats}
            cost={cost}
            screening={screening}
            setSelectedSeats={setSelectedSeats}
            setTakenSeats={setTakenSeats}
            addOptimisticTakenSeats={addOptimisticTakenSeats}
            setReservationLoading={setReservationLoading}
            setReservationError={setReservationError}
          />
        </div>
      </div>
    </section>
  );
}
