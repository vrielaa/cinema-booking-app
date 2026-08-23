import "./booking_movie_card.scss";
import type { Movie } from "../../../types/movie";
import type { Screening } from "../../../types/screening";

export default function BookingMovieCard({
  movie,
  screening,
}: {
  movie: Movie;
  screening: Screening;
}) {
  const { poster_path: src, title, genres } = movie;
  const {
    screening_date: date,
    screening_time: time,
    room_id: roomId,
  } = screening;

  return (
    <aside className="booking-movie-card">
      <img className="booking-poster" src={src} alt={title} />

      <div className="booking-movie-info">
        <p className="booking-movie-label">Now booking</p>
        <h2 className="booking-movie-title">{title}</h2>
        <p className="booking-movie-genres">
          {genres.map((genre) => (
            <span className="booking-movie-genre" key={genre.id}>
              {genre.name}
            </span>
          ))}
        </p>

        <div className="booking-details">
          <div className="booking-detail">
            <span className="booking-detail-label">Date</span>
            <span className="booking-detail-value">{date}</span>
          </div>
          <div className="booking-detail">
            <span className="booking-detail-label">Time</span>
            <span className="booking-detail-value">{time}</span>
          </div>
          <div className="booking-detail">
            <span className="booking-detail-label">Room</span>
            <span className="booking-detail-value">Room {roomId}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
