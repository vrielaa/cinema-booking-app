import "./movie_filters.scss";
import { useState, useEffect } from "react";
import { fetchGenresFromTMDB, searchMovies } from "../../../api";
import useDebounce from "../../../hooks/useDebounce";
import type { Movie } from "../../../types/movie";

export default function MovieFilters({
  setMoviesLoading,
  setMovies,
  page,
  setPage,
  setTotalPages,
}: {
  setMoviesLoading: (loading: boolean) => void;
  setMovies: (movies: Movie[]) => void;
  page: number;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
}) {
  const [titleFilter, setTitleFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genresLoading, setGenresLoading] = useState(true);
  const debouncedTitleFilter = useDebounce(titleFilter, 500);

  const clearFilters = () => {
    setTitleFilter("");
    setGenreFilter(null);
  };

  useEffect(() => {
    searchMovies(
      debouncedTitleFilter,
      genreFilter,
      setMovies,
      setMoviesLoading,
      page,
      setPage,
      setTotalPages,
    );
  }, [
    debouncedTitleFilter,
    genreFilter,
    setMovies,
    setMoviesLoading,
    page,
    setPage,
    setTotalPages,
  ]);

  useEffect(() => {
    fetchGenresFromTMDB(setGenres, setGenresLoading);
  }, []);

  return (
    <section className="movie-filters">
      <div className="movie-filters-heading">
        <div className="movie-filters-heading-copy">
          <p className="movie-filters-eyebrow">Find your movie</p>
          <h2 className="movie-filters-title">Browse the programme</h2>
        </div>

        <p className="movie-filters-description">
          Search the catalogue by title or genre.
        </p>
      </div>

      <div className="movie-filters-controls">
        <label htmlFor="title-filter" className="movie-filter-field">
          <span className="movie-filter-label">Title</span>
          <input
            id="title-filter"
            className="movie-filter-input"
            type="search"
            placeholder="Search by title"
            value={titleFilter}
            onChange={(event) => {
              setTitleFilter(event.target.value);
              setPage(1);
            }}
          />
        </label>

        <label htmlFor="genre-filter" className="movie-filter-field">
          <span className="movie-filter-label">Genre</span>
          <select
            id="genre-filter"
            className="movie-filter-select"
            value={genreFilter === null ? "all" : String(genreFilter.id)}
            onChange={(event) => {
              const selectedGenre = genres.find(
                (g) => String(g.id) === event.target.value,
              );
              setGenreFilter(selectedGenre || null);
              setPage(1);
            }}
            disabled={genresLoading}
          >
            <option value="all">
              {genresLoading ? "Loading genres..." : "All genres"}
            </option>
            {genres.map((genre) => (
              <option key={genre.id} value={String(genre.id)}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <div className="movie-filter-actions">
          <button
            className="movie-filter-button movie-filter-clear-button"
            type="button"
            onClick={() => {
              clearFilters();
              setPage(1);
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}
