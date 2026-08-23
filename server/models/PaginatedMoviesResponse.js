export const PaginatedMoviesResponse = {
  type: "object",
  properties: {
    movies: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Movie",
      },
    },
    pagination: {
      $ref: "#/components/schemas/Pagination",
    },
  },
  required: ["movies", "pagination"],
};
