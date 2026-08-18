import { test, expect } from "./fixtures/booking.fixture.ts";

test.describe("Reservation flow", () => {
  test("successfully reserves a seat", async ({ bookingPage }) => {
    await bookingPage.route("**/api/bookings", async (route) => {
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

    const availableSeat = bookingPage
      .getByRole("button", {
        name: /available$/,
      })
      .first();

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }

    await expect(availableSeat).toBeVisible();

    await availableSeat.click();

    const reserveSeatsButton = bookingPage.getByRole("button", {
      name: "Reserve seats",
    });

    await reserveSeatsButton.click();

    await expect(
      bookingPage.getByRole("dialog", {
        name: "Confirm Reservation",
      }),
    ).toBeVisible();

    const confirmReservationButton = bookingPage.getByRole("button", {
      name: "Confirm Reservation",
    });

    const customerNameInput = bookingPage.getByRole("textbox");

    await expect(confirmReservationButton).toBeVisible();
    await expect(customerNameInput).toBeVisible();

    await expect(confirmReservationButton).toBeDisabled();

    await customerNameInput.fill("name");
    await expect(confirmReservationButton).toBeEnabled();

    const requestPromise = bookingPage.waitForRequest(
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

    await expect(
      bookingPage.getByRole("dialog", {
        name: "Confirm Reservation",
      }),
    ).not.toBeVisible();

    const takenSeat = bookingPage.getByRole("button", {
      name: `${seatId}, taken`,
    });

    await expect(takenSeat).toBeVisible();
  });

  test("shows an error when a selected seat was already reserved", async ({
    bookingPage,
  }) => {
    await bookingPage.route("**/api/bookings", async (route) => {
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

    const availableSeat = bookingPage
      .getByRole("button", {
        name: /available$/,
      })
      .first();

    const accessibleName = await availableSeat.getAttribute("aria-label");
    const seatId = accessibleName?.split(",")[0];

    if (!seatId) {
      throw new Error("Expected the seat to have an accessible name");
    }

    await bookingPage.route("**/api/bookings/1", async (route) => {
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

    const reserveSeatsButton = bookingPage.getByRole("button", {
      name: "Reserve seats",
    });

    await reserveSeatsButton.click();

    await expect(
      bookingPage.getByRole("dialog", {
        name: "Confirm Reservation",
      }),
    ).toBeVisible();

    const confirmReservationButton = bookingPage.getByRole("button", {
      name: "Confirm Reservation",
    });

    const customerNameInput = bookingPage.getByRole("textbox");

    await expect(confirmReservationButton).toBeVisible();
    await expect(customerNameInput).toBeVisible();

    await expect(confirmReservationButton).toBeDisabled();

    await customerNameInput.fill("name");
    await expect(confirmReservationButton).toBeEnabled();

    const requestPromise = bookingPage.waitForRequest(
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

    await expect(
      bookingPage.getByRole("dialog", {
        name: "Confirm Reservation",
      }),
    ).not.toBeVisible();

    await expect(bookingPage.getByRole("alert")).toHaveText(
      "Selected seat has already been reserved",
    );

    const takenSeat = bookingPage.getByRole("button", {
      name: `${seatId}, taken`,
    });

    await expect(takenSeat).toBeVisible();
  });
});
