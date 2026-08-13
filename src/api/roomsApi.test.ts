import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Room } from "../types/room";
import createJsonResponse from "../test/createJsonResponse";
import { fetchRoom } from "./roomsApi";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ROOM
const room: Room = {
  id: 1,
  row_count: 3,
  seats_per_row: 5,
};

const setRowLabels = vi.fn();
const setSeatNumbers = vi.fn();
const setRoomLoading = vi.fn();

const rowLabels = ["A", "B", "C"];
const seatNumbers = [1, 2, 3, 4, 5];

describe("fetchRoom", () => {
  it("should request the room from /api/rooms/1", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(room));

    await fetchRoom(1, setRowLabels, setSeatNumbers, setRoomLoading);

    expect(fetchMock).toHaveBeenCalledWith("/api/rooms/1");
  });

  it("should set loading to true before the request and false after it finishes", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(room));

    await fetchRoom(1, setRowLabels, setSeatNumbers, setRoomLoading);

    expect(setRoomLoading).toHaveBeenCalledTimes(2);
    expect(setRoomLoading).toHaveBeenNthCalledWith(1, true);
    expect(setRoomLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("should create row labels and seat numbers from the fetched room", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(room));

    await fetchRoom(1, setRowLabels, setSeatNumbers, setRoomLoading);

    expect(setRowLabels).toHaveBeenCalledWith(rowLabels);
    expect(setSeatNumbers).toHaveBeenCalledWith(seatNumbers);
  });

  it("should return the fetched room", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(room));

    const result = await fetchRoom(
      1,
      setRowLabels,
      setSeatNumbers,
      setRoomLoading,
    );

    expect(result).toEqual(room);
  });

  it("should throw and avoid updating room data when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse(null, 404, "Not Found"));

    await expect(
      fetchRoom(1, setRowLabels, setSeatNumbers, setRoomLoading),
    ).rejects.toThrow("Failed to load room.");

    expect(setRoomLoading).toHaveBeenCalledTimes(2);
    expect(setRowLabels).not.toHaveBeenCalled();
    expect(setSeatNumbers).not.toHaveBeenCalled();
    expect(setRoomLoading).toHaveBeenNthCalledWith(1, true);
    expect(setRoomLoading).toHaveBeenNthCalledWith(2, false);
  });
});
