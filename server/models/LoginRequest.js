export const LoginRequest = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      example: "gabriela@example.com",
    },
    password: {
      type: "string",
      format: "password",
      example: "password123",
    },
  },
  required: ["email", "password"],
};
