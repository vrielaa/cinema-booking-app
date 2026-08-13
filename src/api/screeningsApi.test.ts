import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Screening } from "../types/screening";
import createJsonResponse from "../test/createJsonResponse";
import {
  fetchScreeningFromScreeningId,
  fetchScreeningsForMovie,
} from "./screeningsApi";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// SCREENING
const setScreening = vi.fn();
const setScreeningLoading = vi.fn();

const screening: Screening = {
  id: 1,
  movie_id: 1,
  room_id: 1,
  screening_date: "2023-10-01",
  screening_time: "18:00",
  row_count: 3,
  seats_per_row: 5,
  movie_title: "Test Movie",
};

describe("fetchScreeningFromScreeningId", () => {
  it("should request the screening from /api/screenings/screening/1", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(screening));

    await fetchScreeningFromScreeningId("1", setScreening, setScreeningLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/screenings/screening/1");
  });

  it("should store and return the screening after a successful response", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(screening));

    const result = await fetchScreeningFromScreeningId(
      "1",
      setScreening,
      setScreeningLoading,
    );

    expect(setScreeningLoading).toHaveBeenCalledTimes(2);
    expect(setScreeningLoading).toHaveBeenNthCalledWith(1, true);
    expect(setScreeningLoading).toHaveBeenNthCalledWith(2, false);
    expect(setScreening).toHaveBeenCalledWith(screening);
    expect(result).toEqual(screening);
  });

  it("should throw and avoid updating the screening when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await expect(
      fetchScreeningFromScreeningId("1", setScreening, setScreeningLoading),
    ).rejects.toThrow("Failed to load screening.");

    expect(setScreeningLoading).toHaveBeenCalledTimes(2);
    expect(setScreeningLoading).toHaveBeenNthCalledWith(1, true);
    expect(setScreeningLoading).toHaveBeenNthCalledWith(2, false);
    expect(setScreening).not.toHaveBeenCalled();
  });
});

describe("fetchScreeningsForMovie", () => {
  const screeningsResponse: Screening[] = [
    screening,
    {
      ...screening,
      id: 2,
      room_id: 2,
      screening_date: "2023-10-02",
      screening_time: "20:00",
      row_count: 4,
      seats_per_row: 6,
    },
  ];

  const setScreenings = vi.fn();
  const setScreeningsLoading = vi.fn();

  it("should fetch screenings for a movie, store them, and finish loading", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(screeningsResponse));

    await fetchScreeningsForMovie(1, setScreenings, setScreeningsLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/screenings/1");
    expect(setScreenings).toHaveBeenCalledWith(screeningsResponse);
    expect(setScreeningsLoading).toHaveBeenCalledTimes(2);
    expect(setScreeningsLoading).toHaveBeenNthCalledWith(1, true);
    expect(setScreeningsLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should log an error when the response is not ok", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await fetchScreeningsForMovie(1, setScreenings, setScreeningsLoading);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching screenings:",
      expect.objectContaining({
        message: "Network response was not ok",
      }),
    );
    expect(setScreenings).not.toHaveBeenCalled();
    expect(setScreeningsLoading).toHaveBeenNthCalledWith(1, true);
    expect(setScreeningsLoading).toHaveBeenNthCalledWith(2, false);
  });
});
