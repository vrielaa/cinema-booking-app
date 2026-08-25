export const Genre = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 28,
    },
    name: {
      type: "string",
      example: "ACTION",
    },
  },
  required: ["id", "name"],
};
