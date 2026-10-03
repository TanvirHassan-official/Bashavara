import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { pool } from "../db.js";
import { requireRole } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

// ── Database Query Helper ────────────────────────────────────────────────────
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ── Validation Schema ────────────────────────────────────────────────────────
const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().trim().min(5, "Review comment must be at least 5 characters").max(2000),
  listingId: z.string().optional(),
});

// ── POST /api/reviews or /api/listings/:id/reviews (students only) ───────────
router.post("/", requireRole("student"), async (req, res) => {
  try {
    const parseResult = createReviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "ValidationError",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const listingId = req.params.id || parseResult.data.listingId;
    const reviewerId = req.user.id;
    const { rating, comment } = parseResult.data;

    if (!listingId) {
      return res.status(400).json({ error: "ValidationError", message: "listingId is required" });
    }

    // 1. Listing must exist
    const [listing] = await query(
      "SELECT id, landlord_id FROM listings WHERE id = ?",
      [listingId]
    );
    if (!listing) {
      return res.status(404).json({ error: "NotFound", message: "Listing not found" });
    }

    // 2. Cannot review your own listing (defensive; students can't own listings)
    if (listing.landlord_id === reviewerId) {
      return res.status(400).json({
        error: "InvalidAction",
        message: "You cannot review your own listing",
      });
    }

    // 3. Verified-tenant rule: must have an ACCEPTED request for this listing
    const [acceptedRequest] = await query(
      `SELECT id FROM requests
       WHERE sender_id = ? AND listing_id = ? AND type = 'listing' AND status = 'accepted'`,
      [reviewerId, listingId]
    );
    if (!acceptedRequest) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only review a listing after your request has been accepted",
      });
    }

    // 4. One review per user per listing (friendly check; the DB unique key is the real guard)
    const [existingReview] = await query(
      "SELECT id FROM reviews WHERE listing_id = ? AND reviewer_id = ?",
      [listingId, reviewerId]
    );
    if (existingReview) {
      return res.status(409).json({
        error: "DuplicateReview",
        message: "You have already reviewed this listing",
      });
    }

    const reviewId = `rev_${crypto.randomUUID().slice(0, 8)}`;
    try {
      await query(
        "INSERT INTO reviews (id, listing_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
        [reviewId, listingId, reviewerId, rating, comment]
      );
    } catch (err) {
      // Two simultaneous submissions hit uk_listing_reviewer
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: "DuplicateReview",
          message: "You have already reviewed this listing",
        });
      }
      throw err;
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      reviewId,
      verifiedTenant: true,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to submit review", message: error.message });
  }
});

// ── GET /api/listings/:id/reviews (public) ───────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const listingId = req.params.id || req.query.listingId;
    if (!listingId) {
      return res.status(400).json({ error: "ValidationError", message: "listingId is required" });
    }

    const reviews = await query(
      `SELECT
         r.id,
         r.rating,
         r.comment,
         r.created_at AS createdAt,
         u.id AS reviewerId,
         u.name AS reviewerName
       FROM reviews r
       JOIN user u ON r.reviewer_id = u.id
       WHERE r.listing_id = ?
       ORDER BY r.created_at DESC`,
      [listingId]
    );

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews", message: error.message });
  }
});

export default router;