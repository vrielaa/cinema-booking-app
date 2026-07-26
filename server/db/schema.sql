CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  poster_path TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS screenings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  screening_date TEXT NOT NULL,
  screening_time TEXT NOT NULL,
  room_name TEXT NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  screening_id INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  seats TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (screening_id) REFERENCES screenings(id)
);
