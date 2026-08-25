export const TmdbMovie = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 550,
      description: "Movie identifier from TMDB",
    },
    title: {
      type: "string",
      example: "Fight Club",
    },
    description: {
      type: "string",
      nullable: true,
      example: "An insomniac office worker forms an underground fight club.",
    },
    genres: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Genre",
      },
    },
    poster_path: {
      type: "string",
      nullable: true,
      format: "uri",
      example: "https://image.tmdb.org/t/p/w500/example.jpg",
    },
  },
  required: ["id", "title", "description", "genres", "poster_path"],
};
