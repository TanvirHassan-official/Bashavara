const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/**
 * Server-side fetch — use in Server Components / Route Handlers.
 * Forwards cookies for auth.
 */
export async function apiFetchServer(path, options = {}) {
  const { headers: customHeaders, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
    ...rest,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

/**
 * Client-side fetch — use in "use client" components.
 */
export async function apiFetchClient(path, options = {}) {
  const { headers: customHeaders, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
    ...rest,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}
