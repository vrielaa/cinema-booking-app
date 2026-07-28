import "./booking_seat_map.scss";

export default function BookingSeatMap({ rowLabels, seatNumbers }) {
  return (
    <div className="booking-seat-map">
      {rowLabels?.map((rowLabel) => (
        <div className="booking-seat-row" key={rowLabel}>
          <span className="booking-row-label">{rowLabel}</span>

          <div className="booking-row-seats">
            {seatNumbers?.map((seatNumber) => (
              <span
                className="booking-seat booking-seat-available"
                key={`${rowLabel}-${seatNumber}`}
                aria-label={`${rowLabel}${seatNumber}, available`}
              >
                {seatNumber}
              </span>
            ))}
          </div>

          <span className="booking-row-label">{rowLabel}</span>
        </div>
      ))}
    </div>
  );
}
