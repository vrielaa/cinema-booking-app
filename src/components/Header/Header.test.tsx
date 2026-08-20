import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../context/AuthContext";
import Header from "./Header";

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => navigateMock,
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const fetchMock = vi.fn<typeof fetch>();
const setIsAuthenticatedMock = vi.fn();
const useAuthMock = vi.mocked(useAuth);

describe("Header", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("fetch", fetchMock);

    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      setIsAuthenticated: setIsAuthenticatedMock,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should render the application heading, home link, login and register button when not authenticated", () => {
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

    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/login",
    );

    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
      "href",
      "/register",
    );

    expect(
      screen.queryByRole("button", { name: "Logout" }),
    ).not.toBeInTheDocument();
  });

  it("should render the logout button when authenticated", () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      setIsAuthenticated: setIsAuthenticatedMock,
      isLoading: false,
    });

    render(<Header />);

    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: "Sign in" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: "Register" }),
    ).not.toBeInTheDocument();
  });

  it("should navigate to login after successful logout", async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      setIsAuthenticated: setIsAuthenticatedMock,
      isLoading: false,
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(<Header />);

    const logoutButton = screen.getByRole("button", { name: "Logout" });

    const user = userEvent.setup();
    await user.click(logoutButton);

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
    });

    expect(navigateMock).toHaveBeenCalledWith({ to: "/login" });
    expect(setIsAuthenticatedMock).toHaveBeenCalledWith(false);
  });
});
