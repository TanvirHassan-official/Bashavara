const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Universal fetch wrapper for BashaVara API calls.
 * Works seamlessly in both Client Components and Server Components.
 *
 * - In Client Components: Uses `credentials: "include"` for cookie authentication.
 * - In Server Components: Automatically forwards incoming cookies via `next/headers`.
 */
export async function apiFetch(endpoint, options = {}) {
  const isServer = typeof window === "undefined";
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = new Headers(options.headers || {});

  // If body is an object and not FormData, stringify it and set Content-Type
  let body = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    body = JSON.stringify(body);
  }

  // Forward cookies when running on the server
  if (isServer) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const cookieString = cookieStore.toString();
      if (cookieString && !headers.has("Cookie")) {
        headers.set("Cookie", cookieString);
      }
    } catch {
      // Ignore if outside request context
    }
  }

  const fetchOptions = {
    ...options,
    headers,
    body,
    // On client side, include cookies in cross-origin requests
    credentials: options.credentials || "include",
  };

  const response = await fetch(url, fetchOptions);

  // Handle errors
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || "An unexpected error occurred" };
    }

    const error = new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // If 204 No Content
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
}

export const api = {
  get: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => apiFetch(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) => apiFetch(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) => apiFetch(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: "DELETE" }),
};
