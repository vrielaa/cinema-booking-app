import type { Movie } from "../types/movie";

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalMovies: number;
};

export async function fetchMovies(
  setMovies: (movies: Movie[]) => void,
  setMoviesLoading: (loading: boolean) => void,
  page?: number,
  setPage?: (page: number) => void,
  setTotalPages?: (totalPages: number) => void,
): Promise<void> {
  setMoviesLoading(true);

  try {
    const response = await fetch(`/api/movies?page=${page || 1}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const movies: Movie[] = data.movies;
    const pagination: Pagination = data.pagination;

    if (setPage) {
      setPage(pagination.currentPage);
    }

    if (setTotalPages) {
      setTotalPages(pagination.totalPages);
    }

    setMovies(movies);
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
  genre: { id: number; name: string } | null,
  setMovies: (movies: Movie[]) => void,
  setMoviesLoading: (loading: boolean) => void,
  page?: number,
  setPage?: (page: number) => void,
  setTotalPages?: (totalPages: number) => void,
): Promise<void> {
  setMoviesLoading(true);

  try {
    const response = await fetch(
      `/api/movies/search?title=${encodeURIComponent(title)}&genre=${encodeURIComponent(genre ? genre.id.toString() : "all")}&page=${page || 1}`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: { movies: Movie[]; pagination: Pagination } =
      await response.json();
    setMovies(data.movies);
    if (setPage) {
      setPage(data.pagination.currentPage);
    }
    if (setTotalPages) {
      setTotalPages(data.pagination.totalPages);
    }
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
