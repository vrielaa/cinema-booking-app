import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router";
import type { Screening } from "../../../types/screening";
import ScreeningsTable from "./ScreeningsTable";

const screening: Screening = {
  id: 1,
  movie_id: 10,
  room_id: 2,
  screening_date: "2026-08-13",
  screening_time: "18:30",
  row_count: 5,
  seats_per_row: 10,
  movie_title: "Test Movie",
};

function createTestRouter() {
  const rootRoute = createRootRoute();

  const bookingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/booking/$screeningId",
  });

  const routeTree = rootRoute.addChildren([bookingRoute]);

  const history = createMemoryHistory({
    initialEntries: ["/"],
  });

  return createRouter({
    routeTree,
    history,
  });
}

describe("Screenings Table router", () => {
  it("should navigate to booking page when a screening is clicked", async () => {
    const router = createTestRouter();
    const user = userEvent.setup();

    render(
      <RouterContextProvider router={router}>
        <ScreeningsTable screenings={[screening]} screeningsLoading={false} />
      </RouterContextProvider>,
    );

    const selectLink = screen.getByRole("link", { name: "Select" });

    expect(selectLink).toHaveAttribute("href", "/booking/1");
    expect(router.state.location.state.screening).toBeUndefined();

    await user.click(selectLink);

    await expect.poll(() => router.state.location.pathname).toBe("/booking/1");

    expect(router.state.location.state.screening).toEqual(screening);
  });
});
