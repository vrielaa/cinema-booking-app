import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { fetchPopularMovies, fetchScreeningsForMovie } from "../../../api";
import type { Movie } from "../../../types/movie";
import Movies from "./Movies";

vi.mock("../../../api", () => ({
  fetchGenresFromTMDB: vi.fn(),
  fetchPopularMovies: vi.fn(),
  fetchScreeningsForMovie: vi.fn(),
  searchMoviesFromTMDB: vi.fn(),
}));

const fetchPopularMoviesMock = vi.mocked(fetchPopularMovies);
const fetchScreeningsForMovieMock = vi.mocked(fetchScreeningsForMovie);

vi.mock("../../Screenings/ScreeningsModal/ScreeningsModal", () => ({
  default: ({
    focusedMovie,
    close,
  }: {
    focusedMovie: Movie;
    close: () => void;
  }) => (
    <div role="dialog" aria-label="Screenings modal">
      <p>{focusedMovie.title}</p>
      <button type="button" onClick={close}>
        Close test modal
      </button>
    </div>
  ),
}));

const movie: Movie = {
  id: 1,
  title: "Test Movie",
  genres: [{ id: 18, name: "Drama" }],
  description: "Test description",
  poster_path: "https://example.com/poster.jpg",
};

describe("Movies", () => {
  it("should replace the loading state with fetched movies", async () => {
    let finishSearch: () => void;

    fetchPopularMoviesMock.mockImplementationOnce(
      (setMovies, setMoviesLoading) =>
        new Promise<void>((resolve) => {
          finishSearch = () => {
            setMovies([movie]);
            setMoviesLoading(false);
            resolve();
          };
        }),
    );

    render(<Movies />);

    expect(
      screen.getByRole("status", {
        name: "Loading movies",
      }),
    ).toBeInTheDocument();

    await act(async () => {
      finishSearch();
    });

    expect(
      await screen.findByRole("button", {
        name: /Test Movie/,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("status", {
        name: "Loading movies",
      }),
    ).not.toBeInTheDocument();
  });

  it("should open the screenings modal after selecting a movie", async () => {
    fetchPopularMoviesMock.mockImplementationOnce(
      async (setMovies, setMoviesLoading) => {
        setMovies([movie]);
        setMoviesLoading(false);
      },
    );

    const user = userEvent.setup();
    render(<Movies />);

    const movieButton = await screen.findByRole("button", {
      name: /Test Movie/,
    });

    expect(
      screen.queryByRole("dialog", {
        name: "Screenings modal",
      }),
    ).not.toBeInTheDocument();

    await user.click(movieButton);

    expect(
      await screen.findByRole("dialog", {
        name: "Screenings modal",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Close test modal",
      }),
    ).toBeInTheDocument();

    expect(fetchScreeningsForMovieMock).toHaveBeenCalledWith(
      movie.id,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("should close the screenings modal after clicking the close button", async () => {
    fetchPopularMoviesMock.mockImplementationOnce(
      async (setMovies, setMoviesLoading) => {
        setMovies([movie]);
        setMoviesLoading(false);
      },
    );

    const user = userEvent.setup();
    render(<Movies />);

    const movieButton = await screen.findByRole("button", {
      name: /Test Movie/,
    });

    await user.click(movieButton);

    expect(
      await screen.findByRole("dialog", {
        name: "Screenings modal",
      }),
    ).toBeInTheDocument();

    const closeButton = await screen.findByRole("button", {
      name: "Close test modal",
    });

    await user.click(closeButton);

    expect(
      screen.queryByRole("dialog", {
        name: "Screenings modal",
      }),
    ).not.toBeInTheDocument();
  });
});
