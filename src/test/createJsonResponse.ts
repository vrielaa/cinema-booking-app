export default function createJsonResponse<T>(
  data: T,
  status = 200,
  statusText = "",
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => data,
  } as Response;
}
