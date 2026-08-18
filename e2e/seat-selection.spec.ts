import { expect, test } from "./fixtures/booking.fixture.ts";

test.describe("Seat selection", () => {
  test("selects an available seat", async ({ bookingPage }) => {
    const availableSeat = bookingPage.availableSeat;

    await expect(availableSeat).toBeVisible();

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }

    await availableSeat.click();

    await expect(bookingPage.selectedSeat(seatId)).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await expect(bookingPage.price(10)).toBeVisible();
  });

  test("unselects an available seat", async ({ bookingPage }) => {
    const availableSeat = bookingPage.availableSeat;

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }
    await availableSeat.click();

    const selectedSeat = bookingPage.selectedSeat(seatId);

    await expect(selectedSeat).toHaveAttribute("aria-pressed", "true");

    await expect(bookingPage.price(10)).toBeVisible();

    await selectedSeat.click();

    await expect(bookingPage.availableSeatById(seatId)).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await expect(bookingPage.price(0)).toBeVisible();
  });

  test("selecting two seats should set the cost to $20.00", async ({
    bookingPage,
  }) => {
    const availableSeats = bookingPage.availableSeats;

    const seat1 = availableSeats.first();
    const seat2 = availableSeats.nth(1);

    await expect(seat1).toBeVisible();
    await expect(seat2).toBeVisible();

    await seat1.click();
    await seat2.click();

    await expect(bookingPage.price(20)).toBeVisible();
  });

  test("reserve seats button is initially disabled", async ({
    bookingPage,
  }) => {
    await expect(bookingPage.price(0)).toBeVisible();

    await expect(bookingPage.reserveSeatsButton).toBeDisabled();
  });

  test("reserve seats button is enabled after selecting a seat", async ({
    bookingPage,
  }) => {
    const availableSeat = bookingPage.availableSeat;

    await availableSeat.click();

    await expect(bookingPage.reserveSeatsButton).toBeEnabled();
  });

  test("opens reservation modal after clicking reserve seats button", async ({
    bookingPage,
  }) => {
    const availableSeat = bookingPage.availableSeat;

    await availableSeat.click();

    const reserveButton = bookingPage.reserveSeatsButton;

    await reserveButton.click();

    await expect(bookingPage.confirmReservationButton).toBeVisible();
  });
});
