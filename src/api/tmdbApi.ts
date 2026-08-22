import type { Movie } from "../types/movie";

export async function fetchPopularMovies(
  setMovies: (movies: Movie[]) => void,
  setMoviesLoading: (loading: boolean) => void,
): Promise<void> {
  setMoviesLoading(true);

  try {
    const response = await fetch("/api/tmdb/movies/popular");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Movie[] = await response.json();
    setMovies(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    setMoviesLoading(false);
  }
}

export async function searchMoviesFromTMDB(
  title: string,
  genreId: string,
  setMovies: (movies: Movie[]) => void,
  setMoviesLoading: (loading: boolean) => void,
): Promise<void> {
  setMoviesLoading(true);
  try {
    const searchParams = new URLSearchParams({ title, genreId });
    const response = await fetch(
      `/api/tmdb/movies/search?${searchParams.toString()}`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Movie[] = await response.json();

    setMovies(data);
  } catch (error) {
    console.error("Error searching movies:", error);
  } finally {
    setMoviesLoading(false);
  }
}

export async function fetchGenresFromTMDB(
  setGenres: (genres: { id: number; name: string }[]) => void,
  setGenresLoading: (loading: boolean) => void,
): Promise<void> {
  setGenresLoading(true);

  try {
    const response = await fetch("/api/tmdb/genres");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: { id: number; name: string }[] = await response.json();
    setGenres(data);
  } catch (error) {
    console.error("Error fetching genres:", error);
  } finally {
    setGenresLoading(false);
  }
}
