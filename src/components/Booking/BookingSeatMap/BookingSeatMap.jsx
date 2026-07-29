import "./booking_seat_map.scss";
import BookingSeat from "../BookingSeat/BookingSeat";

export default function BookingSeatMap({
  rowLabels,
  seatNumbers,
  setSelectedSeats,
  selectedSeats,
  takenSeats,
}) {
  return (
    <div className="booking-seat-map">
      {rowLabels?.map((rowLabel) => (
        <div className="booking-seat-row" key={rowLabel}>
          <span className="booking-row-label">{rowLabel}</span>

          <div className="booking-row-seats">
            {seatNumbers?.map((seatNumber) => (
              <BookingSeat
                key={`${rowLabel}-${seatNumber}`}
                rowLabel={rowLabel}
                seatNumber={seatNumber}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                takenSeats={takenSeats}
              />
            ))}
          </div>

          <span className="booking-row-label">{rowLabel}</span>
        </div>
      ))}
    </div>
  );
}
