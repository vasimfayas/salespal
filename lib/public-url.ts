/**
 * Base address for links emailed to clients and agents. APP_URL when set (the reliable choice in production);
 * otherwise the public host the reverse proxy forwarded, since behind cPanel / Passenger the request's own URL is the
 * internal host and port (e.g. server-123.example.com:3000), which people outside can't reach.
 */
export function publicBaseUrl(request: Request) {
  if (process.env.APP_URL) return process.env.APP_URL;
  const host = request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  if (host) return `${request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || "https"}://${host}`;
  return new URL(request.url).origin;
}
