import type { Movie } from "../types/movie";

export async function fetchMovies(
  setMovies: (movies: Movie[]) => void,
  setMoviesLoading: (loading: boolean) => void,
): Promise<void> {
  setMoviesLoading(true);

  try {
    const response = await fetch("/api/movies");
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

export async function fetchMovie(
  movieId: number,
  setMovie: (movie: Movie) => void,
  setMovieLoading: (loading: boolean) => void,
): Promise<void> {
  setMovieLoading(true);
  try {
    const response = await fetch(`/api/movies/${movieId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Movie = await response.json();
    setMovie(data);
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw new Error("Failed to load movie.", { cause: error });
  } finally {
    setMovieLoading(false);
  }
}

export async function searchMovies(
  title: string,
  genre: string,
  minDuration: number | "",
  maxDuration: number | "",
  setMovies: (movies: Movie[]) => void,
  setMoviesLoading: (loading: boolean) => void,
): Promise<void> {
  setMoviesLoading(true);

  try {
    const response = await fetch(
      `/api/movies/search?title=${encodeURIComponent(title)}&genre=${encodeURIComponent(genre)}&minDuration=${encodeURIComponent(String(minDuration))}&maxDuration=${encodeURIComponent(String(maxDuration))}`,
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

export async function fetchGenres(
  setGenres: (genres: string[]) => void,
  setGenresLoading: (loading: boolean) => void,
): Promise<void> {
  setGenresLoading(true);

  try {
    const response = await fetch("/api/movies/genres");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: string[] = await response.json();
    setGenres(data);
  } catch (error) {
    console.error("Error fetching genres:", error);
  } finally {
    setGenresLoading(false);
  }
}
