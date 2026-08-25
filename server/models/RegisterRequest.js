export const RegisterRequest = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Gabriela",
    },
    email: {
      type: "string",
      format: "email",
      example: "gabriela@example.com",
    },
    password: {
      type: "string",
      format: "password",
      minLength: 8,
      example: "password123",
    },
  },
  required: ["name", "email", "password"],
};
