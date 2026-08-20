export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
