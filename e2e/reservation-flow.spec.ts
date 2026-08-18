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

    const responsePromise = bookingPage.page.waitForResponse(
      (response) =>
        response.url().includes("/api/bookings") &&
        response.request().method() === "POST",
    );

    await confirmReservationButton.click();

    const request = await requestPromise;
    const response = await responsePromise;

    expect(response.status()).toBe(409);

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

  test("shows an error when the reservation server fails", async ({
    bookingPage,
  }) => {
    await bookingPage.page.route("**/api/bookings", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();

        return;
      }

      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Internal Server Error",
        }),
      });
    });

    const availableSeat = bookingPage.availableSeat;

    await expect(availableSeat).toBeVisible();

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }

    await bookingPage.selectFirstAvailableSeat();
    await bookingPage.openReservationModal();

    await expect(bookingPage.reservationDialog).toBeVisible();

    await bookingPage.enterCustomerName("Gabriela");

    await expect(bookingPage.confirmReservationButton).toBeEnabled();

    const responsePromise = bookingPage.page.waitForResponse(
      (response) =>
        response.url().includes("/api/bookings") &&
        response.request().method() === "POST",
    );

    await bookingPage.confirmReservationButton.click();

    const response = await responsePromise;

    expect(response.status()).toBe(500);

    await expect(bookingPage.reservationDialog).toBeHidden();

    await expect(bookingPage.reservationError).toHaveText(
      "Network response was not ok",
    );

    await expect(bookingPage.selectedSeat(seatId)).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await expect(bookingPage.takenSeat(seatId)).toHaveCount(0);

    await expect(bookingPage.price(10)).toBeVisible();
    await expect(bookingPage.reserveSeatsButton).toBeEnabled();
  });
});
