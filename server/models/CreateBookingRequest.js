export const CreateBookingRequest = {
  type: "object",
  properties: {
    screeningId: {
      type: "integer",
      example: 1,
    },
    seats: {
      $ref: "#/components/schemas/SeatMap",
    },
  },
  required: ["screeningId", "seats"],
};
