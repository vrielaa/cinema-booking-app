import "./booking_legend_item.scss";

export default function BookingLegendItem({ type }) {
  return (
    <div className="booking-legend-item">
      <span
        className={`booking-legend-seat booking-legend-${type.toLowerCase()}`}
      ></span>
      <span className="booking-legend-label">{type}</span>
    </div>
  );
}
