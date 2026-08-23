import { useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import MovieFilters from "../MovieFilters/MovieFilters";
import "./movies.scss";
import Modal from "../../Screenings/ScreeningsModal/ScreeningsModal";
import { fetchScreeningsForMovie } from "../../../api";
import type { Movie } from "../../../types/movie";
import type { Screening } from "../../../types/screening";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

const moviesRoute = getRouteApi("/movies");

function Movies() {
  const { title, genre, page } = moviesRoute.useSearch();
  const navigate = useNavigate({ from: "/movies" });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [focusedMovie, setFocusedMovie] = useState<Movie | null>(null);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [screeningsLoading, setScreeningsLoading] = useState(false);

  function openScreeningsModal(movieId: number) {
    const movie = movies.find((m) => m.id === movieId);

    if (!movie) {
      console.error(`Movie with ID ${movieId} not found.`);

      return;
    }
    setFocusedMovie(movie);
    setScreenings([]);
    setScreeningsLoading(true);
    fetchScreeningsForMovie(movieId, setScreenings, setScreeningsLoading);
  }

  function closeScreeningsModal() {
    setFocusedMovie(null);
    setScreenings([]);
    setScreeningsLoading(false);
  }

  return (
    <div className="movies-container">
      <MovieFilters
        setMovies={setMovies}
        setMoviesLoading={setMoviesLoading}
        titleFilter={title}
        genreId={genre}
        page={page}
        setTotalPages={setTotalPages}
        onTitleChange={(nextTitle) => {
          navigate({
            search: (previous) => ({
              ...previous,
              title: nextTitle,
              page: 1,
            }),
            replace: true,
          });
        }}
        onGenreChange={(nextGenreId) => {
          navigate({
            search: (previous) => ({
              ...previous,
              genre: nextGenreId,
              page: 1,
            }),
            replace: true,
          });
        }}
        onClear={() => {
          navigate({
            search: {
              title: "",
              genre: null,
              page: 1,
            },
            replace: true,
          });
        }}
      />

      {moviesLoading ? (
        <div
          className="movies-loading"
          role="status"
          aria-label="Loading movies"
        >
          <div className="movies-loading-spinner" aria-hidden="true" />
        </div>
      ) : (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            selectMovie={() => openScreeningsModal(movie.id)}
          />
        ))
      )}

      {focusedMovie ? (
        <Modal
          focusedMovie={focusedMovie}
          screenings={screenings}
          screeningsLoading={screeningsLoading}
          close={closeScreeningsModal}
        />
      ) : null}
      <div className="pagination-controls">
        <button
          className="pagination-button"
          type="button"
          onClick={() => {
            navigate({
              search: (previous) => ({
                ...previous,
                page: Math.max(previous.page - 1, 1),
              }),
            });
          }}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="pagination-status" aria-live="polite">
          Page {page} of {totalPages}
        </span>
        <button
          className="pagination-button"
          type="button"
          onClick={() => {
            navigate({
              search: (previous) => ({
                ...previous,
                page: Math.min(previous.page + 1, totalPages),
              }),
            });
          }}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Movies;
