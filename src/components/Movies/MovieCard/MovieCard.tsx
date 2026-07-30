import "./movie_card.scss";
import type { Movie } from "../../../types/movie";

const calculateDuration: (duration_minutes: number) => string = (
  duration_minutes: number,
) => {
  const hours = Math.floor(duration_minutes / 60);
  const minutes = duration_minutes % 60;

  return `${hours}h ${minutes}m`;
};

const MovieCard = ({
  movie,
  selectMovie,
}: {
  movie: Movie;
  selectMovie: () => void;
}) => {
  const { title, genre, poster_path, duration_minutes } = movie;

  return (
    <button className="movie-card" type="button" onClick={selectMovie}>
      <img className="movie-poster" src={poster_path} alt={title} />
      <h1 className="movie-card-title">{title}</h1>
      <p className="movie-genre">{genre}</p>
      <p className="movie-duration">
        Duration: {calculateDuration(duration_minutes)}
      </p>
    </button>
  );
};

export default MovieCard;
