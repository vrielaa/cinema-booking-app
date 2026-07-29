import "./movie_filters.scss";
import { useState, useEffect } from "react";
import { searchMovies, fetchGenres } from "../../../utils/fetchFunctions";
import useDebounce from "../../../hooks/useDebounce";

export default function MovieFilters({ setMoviesLoading, setMovies }) {
  const [titleFilter, setTitleFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [genres, setGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(true);
  const [durationFilter, setDurationFilter] = useState("all");

  const debouncedTitleFilter = useDebounce(titleFilter, 500);

  const durationRanges = {
    all: { minDuration: "", maxDuration: "" },
    "under-100": { minDuration: "", maxDuration: 99 },
    "100-129": { minDuration: 100, maxDuration: 129 },
    "130-159": { minDuration: 130, maxDuration: 159 },
    "160-plus": { minDuration: 160, maxDuration: "" },
  };

  const { minDuration, maxDuration } = durationRanges[durationFilter];

  const clearFilters = () => {
    setTitleFilter("");
    setGenreFilter("all");
    setDurationFilter("all");
  };

  useEffect(() => {
    searchMovies(
      debouncedTitleFilter,
      genreFilter,
      minDuration,
      maxDuration,
      setMovies,
      setMoviesLoading,
    );
  }, [
    debouncedTitleFilter,
    genreFilter,
    minDuration,
    maxDuration,
    setMovies,
    setMoviesLoading,
  ]);

  useEffect(() => {
    fetchGenres(setGenres, setGenresLoading);
  }, []);

  return (
    <section className="movie-filters">
      <div className="movie-filters-heading">
        <div className="movie-filters-heading-copy">
          <p className="movie-filters-eyebrow">Find your movie</p>
          <h2 className="movie-filters-title">Browse the programme</h2>
        </div>

        <p className="movie-filters-description">
          Search the catalogue by title, genre, or running time.
        </p>
      </div>

      <div className="movie-filters-controls">
        <label className="movie-filter-field">
          <span className="movie-filter-label">Title</span>
          <input
            className="movie-filter-input"
            type="search"
            placeholder="Search by title"
            value={titleFilter}
            onChange={(event) => setTitleFilter(event.target.value)}
          />
        </label>

        <label className="movie-filter-field">
          <span className="movie-filter-label">Genre</span>
          <select
            className="movie-filter-select"
            value={genreFilter}
            onChange={(event) => setGenreFilter(event.target.value)}
            disabled={genresLoading}
          >
            <option value="all">
              {genresLoading ? "Loading genres..." : "All genres"}
            </option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <label className="movie-filter-field">
          <span className="movie-filter-label">Duration</span>
          <select
            className="movie-filter-select"
            value={durationFilter}
            onChange={(event) => setDurationFilter(event.target.value)}
          >
            <option value="all">Any duration</option>
            <option value="under-100">Under 100 minutes</option>
            <option value="100-129">100–129 minutes</option>
            <option value="130-159">130–159 minutes</option>
            <option value="160-plus">160+</option>
          </select>
        </label>

        <div className="movie-filter-actions">
          <button
            className="movie-filter-button movie-filter-clear-button"
            type="button"
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}
