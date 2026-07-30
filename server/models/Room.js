export const Room = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1,
      description: "Unique identifier for the room",
    },
    row_count: {
      type: "integer",
      example: 10,
      description: "Number of rows in the room",
    },
    seats_per_row: {
      type: "integer",
      example: 15,
      description: "Number of seats per row in the room",
    },
  },
  required: ["id", "row_count", "seats_per_row"],
};
