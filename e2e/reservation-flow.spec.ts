import { test, expect } from "./fixtures/booking.fixture.ts";

test.describe("Reservation flow", () => {
  test("successfully reserves a seat", async ({ bookingPage }) => {
    await bookingPage.page.route("**/api/bookings", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();

        return;
      }

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Booking created successfully",
        }),
      });
    });

    const availableSeat = bookingPage.availableSeat;

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }

    await expect(availableSeat).toBeVisible();

    await availableSeat.click();

    const reserveSeatsButton = bookingPage.reserveSeatsButton;

    await reserveSeatsButton.click();

    await expect(bookingPage.reservationDialog).toBeVisible();

    const confirmReservationButton = bookingPage.confirmReservationButton;

    const customerNameInput = bookingPage.customerNameInput;

    await expect(confirmReservationButton).toBeVisible();
    await expect(customerNameInput).toBeVisible();

    await expect(confirmReservationButton).toBeDisabled();

    await customerNameInput.fill("name");
    await expect(confirmReservationButton).toBeEnabled();

    const requestPromise = bookingPage.page.waitForRequest(
      (request) =>
        request.url().includes("/api/bookings") && request.method() === "POST",
    );

    await confirmReservationButton.click();

    const request = await requestPromise;

    expect(request.postDataJSON()).toEqual({
      screeningId: 1,
      customerName: "name",
      seats: {
        [seatId]: true,
      },
    });

    await expect(bookingPage.confirmReservationButton).not.toBeVisible();

    const takenSeat = bookingPage.takenSeat(seatId);

    await expect(takenSeat).toBeVisible();
  });

  test("shows an error when a selected seat was already reserved", async ({
    bookingPage,
  }) => {
    await bookingPage.page.route("**/api/bookings", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();

        return;
      }

      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Selected seat has already been reserved",
        }),
      });
    });

    const availableSeat = bookingPage.availableSeat;

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }

    await bookingPage.page.route("**/api/bookings/1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          [seatId]: true,
        }),
      });
    });

    await expect(availableSeat).toBeVisible();

    await availableSeat.click();

    const reserveSeatsButton = bookingPage.reserveSeatsButton;

    await reserveSeatsButton.click();

    await expect(bookingPage.reservationDialog).toBeVisible();

    const confirmReservationButton = bookingPage.confirmReservationButton;

    const customerNameInput = bookingPage.customerNameInput;

    await expect(confirmReservationButton).toBeVisible();
    await expect(customerNameInput).toBeVisible();

    await expect(confirmReservationButton).toBeDisabled();

    await customerNameInput.fill("name");
    await expect(confirmReservationButton).toBeEnabled();

    const requestPromise = bookingPage.page.waitForRequest(
      (request) =>
        request.url().includes("/api/bookings") && request.method() === "POST",
    );

    await confirmReservationButton.click();

    const request = await requestPromise;

    expect(request.postDataJSON()).toEqual({
      screeningId: 1,
      customerName: "name",
      seats: {
        [seatId]: true,
      },
    });

    await expect(bookingPage.reservationDialog).not.toBeVisible();

    await expect(bookingPage.reservationError).toHaveText(
      "Selected seat has already been reserved",
    );

    const takenSeat = bookingPage.takenSeat(seatId);

    await expect(takenSeat).toBeVisible();
  });
});
