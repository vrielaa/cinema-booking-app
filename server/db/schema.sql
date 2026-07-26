CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  poster_path TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY,
  row_count INTEGER NOT NULL,
  seats_per_row INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS screenings (
  id INTEGER PRIMARY KEY,
  movie_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL,
  screening_date TEXT NOT NULL,
  screening_time TEXT NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY,
  screening_id INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  seats TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (screening_id) REFERENCES screenings(id)
);
