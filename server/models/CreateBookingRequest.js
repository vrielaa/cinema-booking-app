export const CreateBookingRequest = {
  type: "object",
  properties: {
    screeningId: {
      type: "integer",
      example: 1,
    },
    customerName: {
      type: "string",
      example: "Gabriela",
    },
    seats: {
      $ref: "#/components/schemas/SeatMap",
    },
  },
  required: ["screeningId", "customerName", "seats"],
};
