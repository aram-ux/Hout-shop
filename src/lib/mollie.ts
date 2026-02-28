import { createMollieClient } from "@mollie/api-client";

// Server-side only - do not import in client components
export function getMollieClient() {
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing MOLLIE_API_KEY environment variable");
  }
  return createMollieClient({ apiKey });
}
