import BookingLegend from "./BookingLegend";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("BookingLegend", () => {
  it("should render the booking legend with all legend items", () => {
    render(<BookingLegend />);

    const availableLegendItem = screen.getByText("Available");
    const takenLegendItem = screen.getByText("Taken");
    const selectedLegendItem = screen.getByText("Selected");

    expect(availableLegendItem).toBeInTheDocument();
    expect(takenLegendItem).toBeInTheDocument();
    expect(selectedLegendItem).toBeInTheDocument();
  });
});
