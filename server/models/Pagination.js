export const Pagination = {
  type: "object",
  properties: {
    currentPage: {
      type: "integer",
      minimum: 1,
      example: 1,
      description: "Current page number",
    },
    totalPages: {
      type: "integer",
      minimum: 1,
      example: 3,
      description: "Total number of available pages",
    },
    totalMovies: {
      type: "integer",
      minimum: 0,
      example: 40,
      description: "Total number of movies matching the request",
    },
  },
  required: ["currentPage", "totalPages", "totalMovies"],
};
