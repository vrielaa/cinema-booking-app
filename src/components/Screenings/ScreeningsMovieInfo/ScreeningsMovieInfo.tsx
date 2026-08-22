import "./screenings_movie_info.scss";
import type { Movie } from "../../../types/movie";

export default function ScreeningsMovieInfo({ movie }: { movie: Movie }) {
  const { title, genres, description, poster_path } = movie;

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
        <p className="screenings-movie-genre">
          {genres.map((genre) => genre.name).join(", ")}
        </p>
        <p className="screenings-movie-description">{description}</p>
      </div>
    </>
  );
}
