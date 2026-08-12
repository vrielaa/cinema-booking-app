import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingHeading from "./BookingHeading";

describe("BookingHeading", () => {
  it("should render the booking heading", () => {
    render(<BookingHeading />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Choose your seats",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Seat reservation")).toBeInTheDocument();

    expect(
      screen.getByText("Select the perfect place and enjoy the show."),
    ).toBeInTheDocument();
  });
});
