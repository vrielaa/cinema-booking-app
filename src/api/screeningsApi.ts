import type {
  Screening,
  ScreeningSetter,
  ScreeningsSetter,
} from "../types/screening";

export async function fetchScreeningsForMovie(
  movieId: number,
  setScreenings: ScreeningsSetter,
  setScreeningsLoading: (loading: boolean) => void,
): Promise<void> {
  setScreeningsLoading(true);

  try {
    const response = await fetch(`/api/screenings/${movieId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Screening[] = await response.json();
    setScreenings(data);
  } catch (error) {
    console.error("Error fetching screenings:", error);
  } finally {
    setScreeningsLoading(false);
  }
}

export async function fetchScreeningFromScreeningId(
  screeningId: string,
  setScreening: ScreeningSetter,
  setScreeningLoading: (loading: boolean) => void,
): Promise<Screening> {
  setScreeningLoading(true);
  try {
    const response = await fetch(`/api/screenings/screening/${screeningId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Screening = await response.json();
    setScreening(data);

    return data; // Return the fetched screening data for further use
  } catch (error) {
    console.error("Error fetching screening:", error);
    throw new Error("Failed to load screening.", { cause: error });
  } finally {
    setScreeningLoading(false);
  }
}
