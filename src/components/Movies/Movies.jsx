import { useEffect, useState } from "react";
import MovieCard from "../MovieCard/MovieCard";
import "./movies.scss";

function Movies() {
  const [movies, setMovies] = useState([]);

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

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="movies-container">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          poster_path={movie.poster_path}
          duration_minutes={movie.duration_minutes}
        />
      ))}
    </div>
  );
}

export default Movies;
