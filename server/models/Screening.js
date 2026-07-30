export const Screening = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1,
      description: "Unique identifier for the screening",
    },
    movie_id: {
      type: "integer",
      example: 1,
      description: "The ID of the movie being screened",
    },
    room_id: {
      type: "integer",
      example: 1,
      description: "The ID of the room where the screening takes place",
    },
    screening_date: {
      type: "string",
      format: "date",
      example: "2023-01-01",
      description: "The date of the screening in YYYY-MM-DD format",
    },
    screening_time: {
      type: "string",
      pattern: "^([01]\\d|2[0-3]):[0-5]\\d$",
      example: "19:30",
    },
    row_count: {
      type: "integer",
      example: 10,
    },
    seats_per_row: {
      type: "integer",
      example: 15,
    },
    movie_title: {
      type: "string",
      example: "The Godfather",
    },
  },
  required: [
    "id",
    "movie_id",
    "room_id",
    "screening_date",
    "screening_time",
    "row_count",
    "seats_per_row",
    "movie_title",
  ],
};
