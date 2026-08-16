import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Movie } from "../../../types/movie";
import userEvent from "@testing-library/user-event";
import ScreeningsModal from "./ScreeningsModal";

vi.mock("../ScreeningsTable/ScreeningsTable", () => ({
  default: () => <div>Screenings table</div>,
}));

const movie: Movie = {
  id: 1,
  title: "Test Movie",
  genre: "Drama",
  description: "Test description",
  duration_minutes: 120,
  poster_path: "https://example.com/poster.jpg",
};

describe("ScreeningsModal", () => {
  let modalRoot: HTMLDivElement;

  beforeEach(() => {
    modalRoot = document.createElement("div");
    modalRoot.id = "modal";
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    modalRoot.remove();
    document.body.classList.remove("modal-open");
  });

  it("should render the dialog inside the modal portal", () => {
    render(
      <ScreeningsModal
        focusedMovie={movie}
        screenings={[]}
        screeningsLoading={false}
        close={vi.fn()}
      />,
    );

    expect(
      within(modalRoot).getByRole("dialog", {
        name: "Screenings",
      }),
    ).toBeInTheDocument();

    expect(
      within(modalRoot).getByRole("button", {
        name: "Close modal",
      }),
    ).toBeInTheDocument();

    expect(
      within(modalRoot).getByRole("heading", {
        name: movie.title,
      }),
    ).toBeInTheDocument();

    expect(document.body).toHaveClass("modal-open");
  });

  it("should clean up the modal portal and body class when unmounted", () => {
    const { unmount } = render(
      <ScreeningsModal
        focusedMovie={movie}
        screenings={[]}
        screeningsLoading={false}
        close={vi.fn()}
      />,
    );
    expect(modalRoot).not.toBeEmptyDOMElement();
    expect(document.body).toHaveClass("modal-open");

    unmount();

    expect(modalRoot).toBeEmptyDOMElement();
    expect(document.body).not.toHaveClass("modal-open");
  });

  it("should call the close function when the overlay is clicked", async () => {
    const user = userEvent.setup();
    const closeMock = vi.fn();
    render(
      <ScreeningsModal
        focusedMovie={movie}
        screenings={[]}
        screeningsLoading={false}
        close={closeMock}
      />,
    );

    const overlay = within(modalRoot).getByRole("dialog").parentElement;
    if (!overlay) {
      throw new Error("Overlay element not found");
    }

    await user.click(overlay);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("should call the close function when the close button is clicked", async () => {
    const user = userEvent.setup();
    const closeMock = vi.fn();
    render(
      <ScreeningsModal
        focusedMovie={movie}
        screenings={[]}
        screeningsLoading={false}
        close={closeMock}
      />,
    );

    const closeButton = within(modalRoot).getByRole("button", {
      name: "Close modal",
    });

    await user.click(closeButton);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("should not call the close function when clicking inside the modal content", async () => {
    const user = userEvent.setup();
    const closeMock = vi.fn();
    render(
      <ScreeningsModal
        focusedMovie={movie}
        screenings={[]}
        screeningsLoading={false}
        close={closeMock}
      />,
    );

    const modalContent = within(modalRoot).getByRole("dialog");

    await user.click(modalContent);
    expect(closeMock).not.toHaveBeenCalled();
  });
});
