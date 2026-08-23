export type Movie = {
  id: number;
  title: string;
  genres: { id: number; name: string }[];
  description: string | null;
  poster_path: string;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalMovies: number;
};
