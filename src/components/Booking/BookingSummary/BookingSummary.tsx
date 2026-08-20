import "./booking_summary.scss";
import { useState } from "react";
import BookingReserveModal from "../BookingReserveModal/BookingReserveModal";
import type { Screening } from "../../../types/screening";
import type { SeatMap, SeatSetter } from "../../../types/booking";

export default function BookingSummary({
  isAnySeatSelected,
  selectedSeats,
  cost,
  screening,
  setSelectedSeats,
  setTakenSeats,
  addOptimisticTakenSeats,
  setReservationLoading,
  setReservationError,
  handleBookingError,
}: {
  isAnySeatSelected: boolean;
  selectedSeats: SeatMap;
  cost: number;
  screening: Screening;
  setSelectedSeats: SeatSetter;
  setTakenSeats: SeatSetter;
  addOptimisticTakenSeats: (newTakenSeats: SeatMap) => void;
  setReservationLoading: (loading: boolean) => void;
  setReservationError: (error: string) => void;
  handleBookingError: (error: unknown) => void;
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
          screening={screening}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          setTakenSeats={setTakenSeats}
          addOptimisticTakenSeats={addOptimisticTakenSeats}
          setReservationLoading={setReservationLoading}
          setReservationError={setReservationError}
          closeModal={() => setIsModalOpen(false)}
          handleBookingError={handleBookingError}
        />
      ) : null}
    </div>
  );
}
