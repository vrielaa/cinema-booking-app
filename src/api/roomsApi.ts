import type { Room } from "../types/room";

export async function fetchRoom(
  roomId: number,
  setRowLabels: (labels: string[]) => void,
  setSeatNumbers: (numbers: number[]) => void,
  setRoomLoading: (loading: boolean) => void,
): Promise<Room> {
  setRoomLoading(true);
  try {
    const response = await fetch(`/api/rooms/${roomId}`);
    if (!response.ok) {
      throw new Error("Failed to load room.");
    }

    const data: Room = await response.json();

    const rowLabels = Array.from({ length: data.row_count }, (_, index) =>
      String.fromCharCode(65 + index),
    );

    const seatNumbers = Array.from(
      { length: data.seats_per_row },
      (_, index) => index + 1,
    );

    setRowLabels(rowLabels);
    setSeatNumbers(seatNumbers);

    return data; // Return the fetched room data for further use
  } catch (error) {
    console.error("Error fetching room info:", error);
    throw new Error("Failed to load room.", { cause: error });
  } finally {
    setRoomLoading(false);
  }
}
