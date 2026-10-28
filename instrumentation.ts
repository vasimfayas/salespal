import type { Instrumentation } from "next";

/** Server start: note the deployment (Control Panel → Deployments). */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { recordDeployment } = await import("@/lib/deployments");
  await recordDeployment();
}

/** Any unhandled server error (pages, route handlers, server actions) lands in the Control Panel error log. */
export const onRequestError: Instrumentation.onRequestError = async (error, request) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { logError } = await import("@/lib/error-log");
  const err = error as Error & { digest?: string };
  await logError({ source: "server", message: err?.message ?? String(error), stack: err?.stack, path: request.path, method: request.method, digest: err?.digest });
};
