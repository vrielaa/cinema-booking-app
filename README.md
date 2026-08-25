# Cinema Booking App

A full-stack cinema booking application built with React, TypeScript, Express,
and SQLite. Users can browse a programme synchronized from TMDB, filter movies,
view screenings, select seats, and complete authenticated reservations.

The project focuses on accessible component design, URL-driven state, session
authentication, optimistic UI, API integration, and automated testing at unit,
integration, and end-to-end levels.

## Features

- Responsive, paginated movie catalogue synchronized from TMDB
- Title and genre filters synchronized with URL search parameters
- Shareable catalogue URLs such as `/movies?title=Batman&genre=28&page=1`
- Movie details and screening selection dialog
- Registration, login, logout, and session restoration
- Server-side sessions stored in SQLite and sent through an `HttpOnly` cookie
- Protected booking routes and reservation endpoints
- Direct booking URLs for individual screenings
- Interactive seat map with available, selected, optimistic, and taken states
- Live reservation price calculation
- Loading overlays and user-facing error states
- Booking conflict handling through HTTP `409`
- Interactive OpenAPI documentation with Swagger UI
- Responsive desktop, tablet, and mobile layouts

## Tech Stack

### Frontend

- React 19
- TypeScript
- TanStack Router
- Vite
- SCSS

### Backend

- Node.js and Express 5
- SQLite and better-sqlite3
- express-session with a SQLite session store
- bcrypt password hashing
- TMDB API integration
- OpenAPI and Swagger UI

### Testing and development

- Vitest
- React Testing Library and jest-dom
- Playwright
- Husky
- ESLint and Prettier
- GitHub Actions

## Getting Started

### Prerequisites

- Node.js
- npm
- A TMDB API Read Access Token

### Installation

```bash
git clone https://github.com/vrielaa/cinema-booking-app.git
cd cinema-booking-app
npm install
```

Install Chromium managed by Playwright if you want to run E2E tests:

```bash
npx playwright install chromium
```

Install Gitleaks so the local Git hooks can scan commits before they leave the
machine:

```bash
brew install gitleaks
```

### Environment variables

Create a `.env` file in the project root:

```env
SESSION_SECRET=replace-with-a-long-random-secret
TMDB_API_KEY=your-tmdb-api-read-access-token
TMDB_URL=https://api.themoviedb.org/3
TMDB_BASE_URL=https://image.tmdb.org/t/p/
```

The `.env` file and local SQLite database are ignored by Git.

### Prepare the cinema programme

The synchronization script downloads popular movies from TMDB, stores or
updates them in SQLite, and generates screenings for newly added movies:

```bash
npm run sync:programme
```

### Run the application

Start the API server:

```bash
npm run server
```

Start Vite in another terminal:

```bash
npm run dev
```

The frontend is normally available at `http://localhost:5173`, and the API at
`http://localhost:3000`.

Swagger UI is available at `http://localhost:3000/api/docs` or through the Vite
proxy at `http://localhost:5173/api/docs`.

## Database and Programme Synchronization

The API creates `server/db/database.sqlite` automatically and applies
`server/db/schema.sql`. Static seed data provides the cinema rooms required to
generate screenings.

`npm run sync:programme` then:

1. Downloads multiple pages of popular movies from TMDB.
2. Maps TMDB genres, descriptions, and poster URLs to the local movie model.
3. Inserts new movies and updates existing movies by `tmdb_id`.
4. Generates between three and eight screenings for every newly added movie.
5. Uses a transaction and database constraints to avoid conflicting room times.

The frontend reads the synchronized local catalogue instead of contacting TMDB
directly for every page view.

## Available Scripts

| Command                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `npm run dev`             | Starts the Vite development server               |
| `npm run server`          | Starts the Express API server                    |
| `npm run server:dev`      | Starts the API with a development response delay |
| `npm run sync:programme`  | Synchronizes movies and screenings from TMDB     |
| `npm run build`           | Type-checks and creates a production build       |
| `npm run preview`         | Previews the production build                    |
| `npm run lint`            | Checks the project with ESLint                   |
| `npm run lint:fix`        | Fixes supported ESLint issues                    |
| `npm run format`          | Formats supported files with Prettier            |
| `npm run test`            | Starts Vitest in watch mode                      |
| `npm run test:run`        | Runs the Vitest suite once                       |
| `npm run test:coverage`   | Creates a V8 coverage report                     |
| `npm run test:e2e`        | Runs Playwright E2E tests                        |
| `npm run test:e2e:ui`     | Opens Playwright UI mode                         |
| `npm run test:e2e:headed` | Runs Playwright with a visible browser           |

## Project Structure

```text
cinema-booking-app/
├── e2e/
│   ├── fixtures/               # Reusable Playwright fixtures
│   ├── pages/                  # Playwright page objects
│   └── *.spec.ts               # Browser scenarios
├── server/
│   ├── db/                     # SQLite schema, seed, and setup
│   ├── middleware/             # Authentication middleware
│   ├── models/                 # Reusable OpenAPI schemas
│   ├── routes/                 # Express API routes
│   ├── scripts/                # Programme synchronization
│   ├── services/               # TMDB integration
│   ├── index.js                # API entry point
│   └── swagger.js              # OpenAPI configuration
├── src/
│   ├── api/                    # Frontend API functions
│   ├── components/             # Components grouped by feature
│   ├── context/                # Authentication context
│   ├── hooks/                  # Custom React hooks
│   ├── routes/                 # TanStack Router routes
│   ├── test/                   # Shared Vitest setup
│   ├── types/                  # TypeScript domain types
│   └── utils/                  # Shared utilities
├── playwright.config.ts
├── vitest.config.ts
└── vite.config.ts
```

## API Overview

| Method | Endpoint                                 | Description                                  |
| ------ | ---------------------------------------- | -------------------------------------------- |
| `POST` | `/api/auth/register`                     | Creates a user account                       |
| `POST` | `/api/auth/login`                        | Starts an authenticated session              |
| `POST` | `/api/auth/logout`                       | Destroys the authenticated session           |
| `GET`  | `/api/auth/me`                           | Returns the authenticated user               |
| `GET`  | `/api/movies`                            | Returns a paginated local catalogue          |
| `GET`  | `/api/movies/search`                     | Filters and paginates local movies           |
| `GET`  | `/api/movies/:movieId`                   | Returns one local movie                      |
| `GET`  | `/api/tmdb/genres`                       | Returns genres from TMDB                     |
| `GET`  | `/api/tmdb/movies/popular`               | Returns popular TMDB movies                  |
| `GET`  | `/api/tmdb/movies/search`                | Searches or discovers TMDB movies            |
| `GET`  | `/api/screenings`                        | Returns all screenings                       |
| `GET`  | `/api/screenings/:movieId`               | Returns screenings for a movie               |
| `GET`  | `/api/screenings/screening/:screeningId` | Returns one screening                        |
| `GET`  | `/api/rooms`                             | Returns all rooms                            |
| `GET`  | `/api/rooms/:roomId`                     | Returns room information                     |
| `GET`  | `/api/bookings/:screeningId`             | Returns taken seats; authentication required |
| `POST` | `/api/bookings`                          | Creates a booking; authentication required   |

Complete parameters, response schemas, pagination metadata, examples, and error
responses are documented in Swagger UI under `/api/docs`.

## Booking Flow

1. The user registers or signs in.
2. The user filters the programme and opens a movie's screening dialog.
3. The selected screening is passed to the booking route through router state.
4. A direct booking URL falls back to fetching the screening by ID.
5. The booking hook loads the screening, movie, room, and taken seats.
6. Selected seats are displayed optimistically while a reservation is pending.
7. A successful reservation updates the taken seats.
8. A `409` conflict refreshes the seat map and displays an error.
9. An expired session redirects the user to login and preserves the destination.

## Testing

### Vitest and React Testing Library

The unit and component suite covers API functions, hooks, loading and error
states, controlled forms, seat selection, dialogs, and component composition.
Network calls and router hooks are mocked when isolation is the goal. Generate
V8 coverage with `npm run test:coverage`; its HTML report is written to
`coverage/`.

### Playwright E2E

Playwright runs the application in Chromium against the real Vite and Express
servers. The suite covers the movie catalogue, URL-driven filters, screening
navigation, protected booking pages, seat selection, successful reservations,
booking conflicts, and server failures.

The project uses the following Playwright features and patterns:

- Semantic locators such as `getByRole` and accessible names
- Web-first assertions including `toBeVisible`, `toBeEnabled`, `toHaveURL`,
  `toHaveValue`, and `toHaveAttribute`
- Custom fixtures created with `test.extend` for authenticated booking state and
  programme data loaded dynamically from the API
- API setup through Playwright's request context to register and sign in unique
  E2E users
- A `BookingPage` Page Object that centralizes locators and common actions
- Network interception with `page.route()` and controlled responses through
  `route.fulfill()`
- Request and response synchronization through `waitForRequest()` and
  `waitForResponse()`
- URL polling with `expect.poll()` for debounced filter updates
- Dynamic assertions based on API data and link `href` values instead of
  hardcoded movie or screening IDs
- Automatic frontend and backend startup through Playwright's `webServer`
  configuration
- Chromium configuration, HTML/list/JSON reporters, screenshots on failure,
  and traces on the first retry
- CI retries and a single CI worker for deterministic database scenarios

HAR replay is not part of the default E2E strategy. Explicit `page.route()`
mocks keep each failure scenario and expected API contract visible. Real TMDB
synchronization runs before E2E in CI, while browser tests use the resulting
local programme.

## Local Git Hooks

Husky installs the repository hooks automatically through the npm `prepare`
script:

- `pre-commit` scans staged changes with Gitleaks and runs `npm run lint`
- `pre-push` scans the local Git history with Gitleaks, runs `npm run test:run`,
  and creates a production build

A commit or push is stopped if a secret is detected, Gitleaks is unavailable,
or one of the corresponding quality checks fails.

## Continuous Integration

GitHub Actions runs on pushes and pull requests. The workflow:

1. Scans the full Git history with Gitleaks.
2. Installs dependencies with `npm ci`.
3. Runs lint, Vitest, and the production build.
4. Synchronizes the cinema programme from TMDB using repository secrets.
5. Installs Playwright Chromium with its system dependencies.
6. Runs the E2E suite.
7. Uploads the Playwright JSON report as an artifact when the workflow fails.

## What I Practised

- Migrating a React application from JavaScript to TypeScript
- Splitting the UI into reusable, feature-focused components
- Creating custom hooks, including `useBooking` and `useDebounce`
- Synchronizing filters and pagination with URL search parameters
- Implementing session authentication with secure cookie settings
- Handling optimistic UI, loading, errors, expired sessions, and conflicts
- Integrating and normalizing data from a third-party API
- Generating a local cinema programme from external movie data
- Designing paginated API responses and documenting them with OpenAPI
- Testing components, hooks, API functions, and complete browser workflows
- Building CI around linting, tests, builds, external data setup, and E2E tests
