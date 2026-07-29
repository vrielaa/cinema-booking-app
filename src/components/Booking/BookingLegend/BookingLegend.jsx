import "./booking_legend.scss";
import BookingLegendItem from "../BookingLegendItem/BookingLegendItem";

export default function BookingLegend() {
  return (
    <div className="booking-legend">
      <BookingLegendItem type="Available" />
      <BookingLegendItem type="Taken" />
      <BookingLegendItem type="Selected" />
    </div>
  );
}
