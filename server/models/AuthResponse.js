export const AuthResponse = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Login successful.",
    },
    user: {
      $ref: "#/components/schemas/User",
    },
  },
  required: ["message", "user"],
};
