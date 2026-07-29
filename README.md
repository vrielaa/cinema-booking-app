# Cinema Booking App

A full-stack cinema seat booking application built with React. Users can browse movies, view available screenings, select seats, and confirm a reservation.

The project focuses on component composition, state management, routing, asynchronous data fetching, and handling booking conflicts between the frontend and backend.

## Features

- Responsive movie catalogue
- Movie details and screening selection modal
- Direct booking routes for individual screenings
- Interactive cinema seat map
- Available, selected, and taken seat states
- Live reservation price calculation
- Reservation confirmation with a customer name
- Loading and error states
- Booking conflict handling with an HTTP `409` response
- Automatic refresh of taken seats after a conflict
- Responsive layouts for desktop, tablet, and mobile screens

## Tech Stack

### Frontend

- React 18
- TanStack Router
- Vite
- SCSS

### Backend

- Node.js
- Express
- SQLite
- better-sqlite3

### Development tools

- ESLint
- Prettier

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

Clone the repository:

```bash
git clone https://github.com/vrielaa/cinema-booking-app.git
cd cinema-booking-app
```

Install the dependencies:

```bash
npm install
```

### Run the application

Start the API server in the first terminal:

```bash
npm run server
```

The API will run at `http://localhost:3001`.

Start the frontend in a second terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## Database

The SQLite database is created automatically when the API server starts. If the movies table is empty, the application loads the initial data from `server/db/seed.sql`.

The local `database.sqlite` file is ignored by Git, so each local installation starts with its own database.

## Available Scripts

| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Starts the Vite development server    |
| `npm run server`   | Starts the Express API server         |
| `npm run build`    | Creates a production frontend build   |
| `npm run preview`  | Previews the production build locally |
| `npm run lint`     | Checks the project with ESLint        |
| `npm run lint:fix` | Fixes supported ESLint issues         |
| `npm run format`   | Formats supported files with Prettier |

## Project Structure

```text
cinema-booking-app/
├── public/                 # Images and movie posters
├── server/
│   ├── db/                 # Database schema and seed data
│   ├── routes/             # Express API routes
│   └── index.js            # API entry point
├── src/
│   ├── components/         # React components grouped by feature
│   ├── hooks/              # Custom React hooks
│   ├── routes/             # TanStack Router routes
│   ├── styles/             # Global styles
│   ├── utils/              # Fetch functions
│   └── App.jsx             # Application entry point
└── vite.config.js
```

## API Endpoints

| Method | Endpoint                                 | Description                         |
| ------ | ---------------------------------------- | ----------------------------------- |
| `GET`  | `/api/movies`                            | Returns all movies                  |
| `GET`  | `/api/movies/:movieId`                   | Returns one movie                   |
| `GET`  | `/api/screenings`                        | Returns all screenings              |
| `GET`  | `/api/screenings/:movieId`               | Returns screenings for a movie      |
| `GET`  | `/api/screenings/screening/:screeningId` | Returns one screening               |
| `GET`  | `/api/rooms`                             | Returns all rooms                   |
| `GET`  | `/api/rooms/:roomId`                     | Returns room information            |
| `GET`  | `/api/bookings`                          | Returns all bookings                |
| `GET`  | `/api/bookings/:screeningId`             | Returns taken seats for a screening |
| `POST` | `/api/bookings`                          | Creates a reservation               |

## Booking Flow

1. The user selects a movie.
2. The application loads its screenings.
3. The selected screening is passed to the booking route through router state.
4. When router state is unavailable, the booking page fetches the screening by its URL parameter.
5. The application loads the room, movie, and taken seats.
6. The user selects available seats and confirms the reservation.
7. If another booking has already taken one of those seats, the API returns `409` and the seat map is refreshed.

## What I Practised

- Splitting a React application into reusable components
- Creating a custom `useBooking` hook
- Managing local and derived state
- Fetching related data with `useEffect`
- Passing state through routes while supporting direct URLs
- Handling loading, error, and conflict states
- Building a responsive interface with component-specific SCSS
- Connecting a React frontend to an Express and SQLite backend
