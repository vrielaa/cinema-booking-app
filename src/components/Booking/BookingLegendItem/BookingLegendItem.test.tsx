import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingLegendItem from "./BookingLegendItem";

describe("BookingLegendItem", () => {
  const types = ["Available", "Selected", "Taken"];

  const renderBookingLegendItem = (type: string) => {
    return render(<BookingLegendItem type={type} />);
  };

  types.forEach((type) => {
    it(`should render the ${type} legend item correctly`, () => {
      renderBookingLegendItem(type);

      const legendItem = screen.getByText(type);
      expect(legendItem).toBeInTheDocument();
    });
  });
});
