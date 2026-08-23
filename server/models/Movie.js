export const Movie = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1,
      description: "Unique identifier for the movie",
    },
    tmdb_id: {
      type: "integer",
      example: 238,
      description: "Movie identifier from TMDB",
    },
    title: {
      type: "string",
      example: "The Godfather",
      description: "The title of the movie",
    },
    genres: {
      type: "array",
      description: "TMDB genres assigned to the movie",
      items: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 80,
          },
          name: {
            type: "string",
            example: "CRIME",
          },
        },
        required: ["id", "name"],
      },
    },
    description: {
      type: "string",
      example:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      description: "A brief summary of the movie's plot",
      nullable: true,
    },
    poster_path: {
      type: "string",
      example: "https://image.tmdb.org/t/p/w500/example.jpg",
      description: "Full URL of the movie poster image",
      nullable: true,
    },
  },
  required: ["id", "tmdb_id", "title", "genres"],
};
