import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import Header from "./Header";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("Header", () => {
  it("should render the application heading and home link", () => {
    render(<Header />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Cinema Booking App",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Cinema Booking App" }),
    ).toHaveAttribute("href", "/");
  });
});
