import { apiFetchClient } from "./api-client";

/**
 * Login with email + password.
 * @returns {{ user, token }} on success
 */
export async function login(email, password) {
  return apiFetchClient("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Register a new user.
 * @param {{ name, email, password, role }} data
 */
export async function register(data) {
  return apiFetchClient("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Logout the current user (clears httpOnly cookie on server).
 */
export async function logout() {
  return apiFetchClient("/api/auth/logout", { method: "POST" });
}

/**
 * Get the current session / user profile.
 * Returns null if unauthenticated.
 */
export async function getSession() {
  try {
    return await apiFetchClient("/api/auth/session");
  } catch {
    return null;
  }
}
