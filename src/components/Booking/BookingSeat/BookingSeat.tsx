import "./booking_seat.scss";
import type { BookingSeatProps } from "../../../types/booking";

export default function BookingSeat({
  rowLabel,
  seatNumber,
  selectedSeats,
  setSelectedSeats,
  takenSeats,
}: BookingSeatProps) {
  const seatId = `${rowLabel}${seatNumber}`;
  const isSelected = Boolean(selectedSeats[seatId]);
  const isTaken = Boolean(takenSeats[seatId]);
  const seatStatus = isTaken ? "taken" : isSelected ? "selected" : "available";

  const toggleSeatSelection = () => {
    if (isTaken) {
      return;
    }

    setSelectedSeats((prevSelectedSeats) => {
      const newSelectedSeats = { ...prevSelectedSeats };
      if (newSelectedSeats[seatId]) {
        delete newSelectedSeats[seatId];
      } else {
        newSelectedSeats[seatId] = true;
      }

      return newSelectedSeats;
    });
  };

  return (
    <button
      className={`booking-seat booking-seat-${seatStatus}`}
      type="button"
      aria-label={`${seatId}, ${seatStatus}`}
      aria-pressed={isSelected}
      disabled={isTaken}
      onClick={toggleSeatSelection}
    >
      {seatNumber}
    </button>
  );
}
