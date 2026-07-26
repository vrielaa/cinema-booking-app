import { useEffect, useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import "./movies.scss";
import Modal from "../ScreeningsModal/ScreeningsModal";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [focusedMovieId, setFocusedMovieId] = useState();

  async function fetchMovies() {
    try {
      const response = await fetch("/api/movies");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  async function fetchScreeningsForMovie(movieId) {
    try {
      const response = await fetch(`/api/screenings/${movieId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setScreenings(data);
    } catch (error) {
      console.error("Error fetching screenings:", error);
    }
  }

  function openScreeningsModal(movieId) {
    setFocusedMovieId(movieId);
    setScreenings([]);
    fetchScreeningsForMovie(movieId);
  }

  function closeScreeningsModal() {
    setFocusedMovieId(null);
    setScreenings([]);
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  const focusedMovie = movies.find((movie) => movie.id === focusedMovieId);

  return (
    <div className="movies-container">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          genre={movie.genre}
          poster_path={movie.poster_path}
          duration_minutes={movie.duration_minutes}
          onClick={() => openScreeningsModal(movie.id)}
        />
      ))}
      {focusedMovie ? (
        <Modal
          title={focusedMovie.title}
          genre={focusedMovie.genre}
          description={focusedMovie.description}
          duration_minutes={focusedMovie.duration_minutes}
          poster_path={focusedMovie.poster_path}
          screenings={screenings}
          close={closeScreeningsModal}
        />
      ) : null}
    </div>
  );
}

export default Movies;
