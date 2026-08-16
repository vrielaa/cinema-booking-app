import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Route } from "./booking.$screeningId.lazy";

vi.mock("../components/Booking/Booking/Booking", () => ({
  default: ({ screeningId }: { screeningId: string }) => (
    <div>Booking screening {screeningId}</div>
  ),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("booking route", () => {
  it("should pass the screeningId route parameter to Booking", () => {
    vi.spyOn(Route, "useParams").mockReturnValue({
      screeningId: "3",
    });

    const BookingPage = Route.options.component;

    if (!BookingPage) {
      throw new Error("Booking route component is missing");
    }

    render(<BookingPage />);

    expect(screen.getByText("Booking screening 3")).toBeInTheDocument();
  });
});
