import { useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import MovieFilters from "../MovieFilters/MovieFilters";
import "./movies.scss";
import Modal from "../../Screenings/ScreeningsModal/ScreeningsModal";
import { fetchScreeningsForMovie } from "../../../api";
import type { Movie } from "../../../types/movie";
import type { Screening } from "../../../types/screening";

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
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
      <MovieFilters setMovies={setMovies} setMoviesLoading={setMoviesLoading} />

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
    </div>
  );
}

export default Movies;
