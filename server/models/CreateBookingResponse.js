export const CreateBookingResponse = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1,
    },
    screeningId: {
      type: "integer",
      example: 3,
    },
    customerName: {
      type: "string",
      example: "Gabriela",
    },
    seats: {
      $ref: "#/components/schemas/SeatMap",
    },
  },
  required: ["id", "screeningId", "customerName", "seats"],
};
