import "./booking_summary.scss";
import { useState } from "react";
import BookingReserveModal from "../BookingReserveModal/BookingReserveModal";

export default function BookingSummary({
  isAnySeatSelected,
  selectedSeats,
  cost,
  movie,
  screening,
  setSelectedSeats,
  setTakenSeats,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
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
        disabled={!isAnySeatSelected}
        onClick={() => setIsModalOpen(true)}
      >
        Reserve seats
      </button>

      {isModalOpen ? (
        <BookingReserveModal
          screeningId={screening?.id}
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
  );
}
