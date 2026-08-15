import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useDebounce from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("should return the previous value before the delay passes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "" },
      },
    );

    rerender({ value: "Batman" });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe("");
  });

  it("should return the new value after the delay passes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "" },
      },
    );

    rerender({ value: "Batman" });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("Batman");
  });

  it("should reset the timer if the value changes before the delay passes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "" },
      },
    );

    rerender({ value: "Batman" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: "Superman" });

    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("Superman");
  });
});
