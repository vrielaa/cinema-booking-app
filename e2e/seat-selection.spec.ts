import { expect, test } from "./fixtures/booking.fixture.ts";

test.describe("Seat selection", () => {
  test("selects an available seat", async ({ bookingPage }) => {
    const availableSeat = bookingPage
      .getByRole("button", {
        name: /, available$/,
      })
      .first();

    await expect(availableSeat).toBeVisible();

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }

    await availableSeat.click();

    await expect(
      bookingPage.getByRole("button", {
        name: `${seatId}, selected`,
      }),
    ).toHaveAttribute("aria-pressed", "true");

    await expect(
      bookingPage.getByText("$10.00", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("unselects an available seat", async ({ bookingPage }) => {
    const availableSeat = bookingPage
      .getByRole("button", {
        name: /, available$/,
      })
      .first();

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }
    await availableSeat.click();

    const selectedSeat = bookingPage.getByRole("button", {
      name: `${seatId}, selected`,
    });

    await expect(
      bookingPage.getByRole("button", {
        name: `${seatId}, selected`,
      }),
    ).toHaveAttribute("aria-pressed", "true");

    await expect(
      bookingPage.getByText("$10.00", {
        exact: true,
      }),
    ).toBeVisible();

    await selectedSeat.click();

    await expect(
      bookingPage.getByRole("button", {
        name: `${seatId}, available`,
      }),
    ).toHaveAttribute("aria-pressed", "false");

    await expect(
      bookingPage.getByText("$0.00", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("selecting two seats should set the cost to $20.00", async ({
    bookingPage,
  }) => {
    const availableSeats = bookingPage.getByRole("button", {
      name: /, available$/,
    });

    const seat1 = availableSeats.first();
    const seat2 = availableSeats.nth(1);

    await expect(seat1).toBeVisible();
    await expect(seat2).toBeVisible();

    await seat1.click();
    await seat2.click();

    await expect(
      bookingPage.getByText("$20.00", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("reserve seats button is initially disabled", async ({
    bookingPage,
  }) => {
    await expect(
      bookingPage.getByText("$0.00", {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      bookingPage.getByRole("button", {
        name: "Reserve seats",
      }),
    ).toBeDisabled();
  });

  test("reserve seats button is enabled after selecting a seat", async ({
    bookingPage,
  }) => {
    const availableSeat = bookingPage
      .getByRole("button", {
        name: /, available$/,
      })
      .first();

    await availableSeat.click();

    await expect(
      bookingPage.getByRole("button", {
        name: "Reserve seats",
      }),
    ).toBeEnabled();
  });

  test("opens reservation modal after clicking reserve seats button", async ({
    bookingPage,
  }) => {
    const availableSeat = bookingPage
      .getByRole("button", {
        name: /, available$/,
      })
      .first();

    await availableSeat.click();

    const reserveButton = bookingPage.getByRole("button", {
      name: "Reserve seats",
    });

    await reserveButton.click();

    await expect(
      bookingPage.getByRole("dialog", {
        name: "Confirm Reservation",
      }),
    ).toBeVisible();
  });
});
