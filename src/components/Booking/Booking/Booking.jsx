import "./booking.scss";
import BookingSeatMap from "../BookingSeatMap/BookingSeatMap";
import BookingMovieCard from "../BookingMovieCard/BookingMovieCard";
import BookingLegend from "../BookingLegend/BookingLegend";
import BookingHeading from "../BookingHeading/BookingHeading";
import BookingSummary from "../BookingSummary/BookingSummary";
import useBooking from "../../../hooks/useBooking";

export default function Booking({ screeningId }) {
  const {
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
