import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Server-side session retrieval for Next.js Server Components, Server Actions, & Route Handlers.
 * Forwards incoming cookies to the Express BetterAuth backend.
 *
 * @returns {Promise<{ session: object, user: object } | null>}
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error("Failed to fetch server-side session:", error);
    return null;
  }
}
