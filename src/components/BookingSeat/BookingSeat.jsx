import "./booking_seat.scss";

export default function BookingSeat({
  rowLabel,
  seatNumber,
  selectedSeats,
  setSelectedSeats,
  takenSeats,
}) {
  const seatId = `${rowLabel}${seatNumber}`;
  let isSelected = Boolean(selectedSeats[seatId]);
  let isTaken = Boolean(takenSeats[seatId]);

  const toggleSeatSelection = () => {
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
      className={`booking-seat ${isSelected ? "booking-seat-selected" : "booking-seat-available"} ${isTaken ? "booking-seat-taken" : ""}`}
      aria-label={`${rowLabel}${seatNumber}, ${isSelected ? "selected" : "available"}`}
      onClick={toggleSeatSelection}
    >
      {seatNumber}
    </button>
  );
}
