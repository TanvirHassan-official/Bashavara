import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { auth } from "./auth.js";
import { toNodeHandler } from "better-auth/node";
import { initDatabase } from "./db.js";
import { requireAuth, requireRole } from "./middleware/auth.js";

// Route Handlers
import listingsRouter from "./routes/listings.js";
import requestsRouter from "./routes/requests.js";
import reviewsRouter from "./routes/reviews.js";
import roommatesRouter from "./routes/roommates.js";
import statsRouter from "./routes/stats.js";

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ── Reverse Proxy Trust (Required for Render, Railway, Vercel, Heroku) ──
app.set("trust proxy", 1);

// ── Security & Headers (Helmet) ──────────────────────────────────────
app.use(helmet());

// ── Global Rate Limiting ────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ── Auth Rate Limiting ──────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit auth attempts to 60 per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "TooManyRequests",
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});
app.use("/api/auth", authLimiter);

// ── CORS ────────────────────────────────────────────────────────────
// Allow frontend origin with credentials enabled for session cookies
const allowedOrigins = FRONTEND_URL.split(",").map((s) => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ── BetterAuth handler ──────────────────────────────────────────────
// MUST be mounted BEFORE express.json()
// Express 4 uses "/api/auth/*", Express 5 uses "/api/auth/*splat"
app.all("/api/auth/*splat", toNodeHandler(auth));
app.all("/api/auth/*", toNodeHandler(auth));

// ── Body Parser ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    frontendUrl: FRONTEND_URL,
  });
});

// ── API Business Routes ─────────────────────────────────────────────
app.use("/api/listings", listingsRouter);
app.use("/api/listings/:id/reviews", reviewsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/roommates", roommatesRouter);
app.use("/api/me", roommatesRouter);
app.use("/api/stats", statsRouter);

// ── Write Rate Limiting ─────────────────────────────────────────────
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit write requests to 100 per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "TooManyRequests",
    message: "Too many write requests. Please try again after a few minutes.",
  },
});

// Apply writeLimiter to all modifying HTTP methods under /api
app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  next();
});

// ── Example Protected Routes ────────────────────────────────────────
app.get("/api/me/session", requireAuth, (req, res) => {
  res.json({ user: req.user, session: req.session });
});

app.get("/api/landlord/protected", requireRole("landlord"), (req, res) => {
  res.json({ message: "Welcome Landlord!", user: req.user });
});

// ── 404 Handler ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    error: "NotFound",
    message: "The requested API endpoint does not exist",
  });
});

// ── Centralized Express Error Handler ───────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Centralized Express Error Handler:", err);
  const status = err.status || err.statusCode || 500;
  const errorName = err.name || "ServerError";
  const errorMessage = err.message || "An unexpected error occurred on the server";

  res.status(status).json({
    error: errorName,
    message: errorMessage,
    ...(err.errors ? { errors: err.errors } : {}),
  });
});

// ── Database Verification & Server Start ────────────────────────────
async function startServer() {
  try {
    await initDatabase();
  } catch (err) {
    console.warn("⚠️ MySQL initialization warning:", err.message);
    console.warn("Please make sure MySQL is running and your .env DATABASE_URL is configured.");
  }

  app.listen(PORT, () => {
    console.log(`✓ BashaVara API running on http://localhost:${PORT}`);
    console.log(`✓ Accepting requests from ${FRONTEND_URL}`);
  });
}

startServer();

export { app, requireAuth, requireRole };
