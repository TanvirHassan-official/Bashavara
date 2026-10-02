import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

/**
 * Middleware that requires a valid BetterAuth session.
 * Attaches `req.user` and `req.session` on success.
 */
export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required to access this endpoint",
      });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "AuthError",
      message: error.message || "Failed to authenticate session",
    });
  }
}

/**
 * Middleware factory that requires a specific user role (e.g. 'landlord', 'student').
 */
export function requireRole(role) {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Authentication required to access this endpoint",
        });
      }

      if (session.user.role !== role) {
        return res.status(403).json({
          error: "Forbidden",
          message: `Access denied. This action requires the '${role}' role.`,
        });
      }

      req.user = session.user;
      req.session = session.session;
      next();
    } catch (error) {
      return res.status(500).json({
        error: "AuthError",
        message: error.message || "Failed to verify user permissions",
      });
    }
  };
}
