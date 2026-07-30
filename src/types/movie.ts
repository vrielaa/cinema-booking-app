export type Movie = {
  id: number;
  title: string;
  genre: string;
  description: string | null;
  duration_minutes: number;
  poster_path: string;
};

export type DurationRange = {
  minDuration: number | "";
  maxDuration: number | "";
  label: string;
};

export type DurationRanges = Record<string, DurationRange>;
