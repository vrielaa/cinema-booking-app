import { type Page, expect } from "@playwright/test";

export class BookingPage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get availableSeat() {
    return this.page.getByRole("button", { name: /, available$/ }).first();
  }
  get availableSeats() {
    return this.page.getByRole("button", { name: /, available$/ });
  }


  get reserveSeatsButton() {
    return this.page.getByRole("button", {
      name: "Reserve seats",
    });
  }

  get confirmReservationButton() {
    return this.page.getByRole("button", {
      name: "Confirm Reservation",
    });
  }

  get reservationDialog() {
    return this.page.getByRole("dialog", {
      name: "Confirm Reservation",
    });
  }

  get customerNameInput() {
    return this.reservationDialog.getByRole("textbox");
  }

  get reservationError() {
    return this.page.getByRole("alert");
  }

  async goto(path: string) {
    await this.page.goto(`/booking/${path}`);
  }

  async waitUntilLoaded() {
    await expect(
      this.page.getByRole("heading", {
        name: "Choose your seats",
        level: 1,
      }),
    ).toBeVisible();
  }

  availableSeatById(seatId: string) {
    return this.page.getByRole("button", {
      name: `${seatId}, available`,
    });
  }
  selectedSeat(seatId: string) {
    return this.page.getByRole("button", {
      name: `${seatId}, selected`,
    });
  }

  takenSeat(seatId: string) {
    return this.page.getByRole("button", {
      name: `${seatId}, taken`,
    });
  }

  price(amount: number) {
    return this.page.getByText(`$${amount.toFixed(2)}`, {
      exact: true,
    });
  }

  async selectFirstAvailableSeat() {
    await this.availableSeat.click();
  }

  async openReservationModal() {
    await this.reserveSeatsButton.click();
  }

  async enterCustomerName(name: string) {
    await this.customerNameInput.fill(name);
  }
}
