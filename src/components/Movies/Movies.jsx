import { useEffect, useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import "./movies.scss";
import Modal from "../ScreeningsModal/ScreeningsModal";
import {
  fetchMovies,
  fetchScreeningsForMovie,
} from "../../utils/fetchFunctions";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [focusedMovie, setFocusedMovie] = useState(null);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [screeningsLoading, setScreeningsLoading] = useState(false);

  function openScreeningsModal(movieId) {
    const movie = movies.find((m) => m.id === movieId);
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

  useEffect(() => {
    fetchMovies(setMovies, setMoviesLoading);
  }, []);

  return (
    <div className="movies-container">
      {moviesLoading ? (
        <p className="movies-loading">Loading movies...</p>
      ) : (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            genre={movie.genre}
            poster_path={movie.poster_path}
            duration_minutes={movie.duration_minutes}
            onClick={() => openScreeningsModal(movie.id)}
          />
        ))
      )}

      {focusedMovie ? (
        <Modal
          title={focusedMovie.title}
          genre={focusedMovie.genre}
          description={focusedMovie.description}
          duration_minutes={focusedMovie.duration_minutes}
          poster_path={focusedMovie.poster_path}
          screenings={screenings}
          screeningsLoading={screeningsLoading}
          close={closeScreeningsModal}
        />
      ) : null}
    </div>
  );
}

export default Movies;
