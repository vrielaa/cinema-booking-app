import "./movie_card.scss";
import type { Movie } from "../../../types/movie";

const MovieCard = ({
  movie,
  selectMovie,
}: {
  movie: Movie;
  selectMovie: () => void;
}) => {
  const { title, genres, poster_path } = movie;

  return (
    <button className="movie-card" type="button" onClick={selectMovie}>
      <img className="movie-poster" src={poster_path} alt={title} />
      <h1 className="movie-card-title">{title}</h1>
      <p className="movie-genre">
        {genres.map((genre) => genre.name).join(", ")}
      </p>
    </button>
  );
};

export default MovieCard;
