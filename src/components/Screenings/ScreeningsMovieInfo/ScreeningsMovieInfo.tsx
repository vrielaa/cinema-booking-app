import "./screenings_movie_info.scss";
import type { Movie } from "../../../types/movie";

export default function ScreeningsMovieInfo({ movie }: { movie: Movie }) {
  const { title, genre, description, duration_minutes, poster_path } = movie;

  return (
    <>
      <div className="screenings-movie-poster-frame">
        <img
          className="screenings-movie-poster"
          src={poster_path}
          alt={title}
        />
      </div>

      <div className="screenings-movie-info">
        <h1 className="screenings-movie-title">{title}</h1>
        <p className="screenings-movie-duration">
          Duration: {Math.floor(duration_minutes / 60)}h {duration_minutes % 60}
          m
        </p>
        <p className="screenings-movie-genre">{genre}</p>
        <p className="screenings-movie-description">{description}</p>
      </div>
    </>
  );
}
