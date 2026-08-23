import { createFileRoute } from "@tanstack/react-router";

export type MoviesSearch = {
  title: string;
  genre: number | null;
  page: number;
};

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

export const Route = createFileRoute("/movies")({
  validateSearch: (search: Record<string, unknown>): MoviesSearch => ({
    title: typeof search.title === "string" ? search.title : "",
    genre: parsePositiveInteger(search.genre),
    page: parsePositiveInteger(search.page) ?? 1,
  }),
});
