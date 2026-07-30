export const Movie = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1,
      description: "Unique identifier for the movie",
    },
    title: {
      type: "string",
      example: "The Godfather",
      description: "The title of the movie",
    },
    genre: {
      type: "string",
      example: "Crime",
      description: "The genre of the movie",
    },
    description: {
      type: "string",
      example:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      description: "A brief summary of the movie's plot",
      nullable: true,
    },
    duration_minutes: {
      type: "integer",
      example: 175,
      description: "Duration of the movie in minutes",
    },
    poster_path: {
      type: "string",
      example: "/posters/interstellar.webp",
      description:
        "Path to the movie poster image, in the public folder, webp format",
    },
  },
  required: ["id", "title", "genre", "duration_minutes", "poster_path"],
};
