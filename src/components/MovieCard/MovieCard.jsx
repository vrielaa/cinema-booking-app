import "./movie_card.scss";

const calculateDuration = (duration_minutes) => {
  const hours = Math.floor(duration_minutes / 60);
  const minutes = duration_minutes % 60;

  return `${hours}h ${minutes}m`;
};

const MovieCard = ({ title, genre, poster_path, duration_minutes, onClick }) => {
  return (
    <button className="movie-card" type="button" onClick={onClick}>
      <img className="movie-poster" src={poster_path} alt={title} />
      <h1>{title}</h1>
      <p className="movie-genre">{genre}</p>
      <p className="movie-duration">
        Duration: {calculateDuration(duration_minutes)}
      </p>
    </button>
  );
};

export default MovieCard;
