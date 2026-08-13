import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Screening } from "../../../types/screening";
import ScreeningsTable from "./ScreeningsTable";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: ReactNode;
    to: string;
    params: { screeningId: string };
  }) => <a href={to.replace("$screeningId", params.screeningId)}>{children}</a>,
}));

const screenings: Screening[] = [
  {
    id: 1,
    movie_id: 10,
    room_id: 2,
    screening_date: "2026-08-13",
    screening_time: "18:30",
    row_count: 5,
    seats_per_row: 10,
    movie_title: "Test Movie",
  },
  {
    id: 2,
    movie_id: 10,
    room_id: 3,
    screening_date: "2026-08-14",
    screening_time: "20:00",
    row_count: 6,
    seats_per_row: 8,
    movie_title: "Test Movie",
  },
];

describe("ScreeningsTable", () => {
  it("should display the loading state", () => {
    render(<ScreeningsTable screenings={[]} screeningsLoading={true} />);

    expect(screen.getByText("Loading screenings...")).toBeInTheDocument();
  });

  it("should display the table headings and screening rows", () => {
    render(
      <ScreeningsTable screenings={screenings} screeningsLoading={false} />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Date" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Time" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Room" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Seats" }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByText("2026-08-13")).toBeInTheDocument();
    expect(screen.getByText("18:30")).toBeInTheDocument();
    expect(screen.getByText("Room #2")).toBeInTheDocument();
    expect(screen.getByText("5 x 10")).toBeInTheDocument();
    expect(screen.getByText("2026-08-14")).toBeInTheDocument();
    expect(screen.getByText("20:00")).toBeInTheDocument();
    expect(screen.getByText("Room #3")).toBeInTheDocument();
    expect(screen.getByText("6 x 8")).toBeInTheDocument();

    const selectLinks = screen.getAllByRole("link", { name: "Select" });
    expect(selectLinks).toHaveLength(2);
    expect(selectLinks[0]).toHaveAttribute("href", "/booking/1");
    expect(selectLinks[1]).toHaveAttribute("href", "/booking/2");
  });

  it("should display no screening rows when the result is empty", () => {
    render(<ScreeningsTable screenings={[]} screeningsLoading={false} />);

    expect(screen.getAllByRole("row")).toHaveLength(1);
  });
});
