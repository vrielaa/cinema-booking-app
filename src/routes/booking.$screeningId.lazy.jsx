import { createLazyFileRoute } from "@tanstack/react-router";
import Booking from "../components/Booking/Booking/Booking";

export const Route = createLazyFileRoute("/booking/$screeningId")({
  component: BookingPage,
});

function BookingPage() {
  const { screeningId } = Route.useParams(); // Get the screeningId from the route parameters

  return <Booking screeningId={screeningId} />;
}
