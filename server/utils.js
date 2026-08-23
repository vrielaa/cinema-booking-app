export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function parseMovie(movie) {
  return {
    ...movie,
    genres: JSON.parse(movie.genres),
  };
}

export function parsePage(value) {
  const parsedPage = Number(value);

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}
