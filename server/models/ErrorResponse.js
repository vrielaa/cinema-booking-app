export const ErrorResponse = {
  type: "object",
  properties: {
    error: {
      type: "string",
      example: "Movie not found",
    },
  },
  required: ["error"],
};
