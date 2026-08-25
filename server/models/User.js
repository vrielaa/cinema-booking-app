export const User = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1,
    },
    name: {
      type: "string",
      example: "Gabriela",
    },
    email: {
      type: "string",
      format: "email",
      example: "gabriela@example.com",
    },
    role: {
      type: "string",
      example: "customer",
    },
  },
  required: ["id", "name", "email", "role"],
};
