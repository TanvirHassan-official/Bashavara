import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

// ── Database Query Helper ────────────────────────────────────────────────────
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ── Validation Schema ────────────────────────────────────────────────────────
const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
  listingId: z.string().optional(),
});

// ── POST /api/reviews or /api/listings/:id/reviews ───────────────────────────
router.post("/", requireAuth, async (req, res) => {
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

    // 1. Verify listing exists
    const [listing] = await query("SELECT id, landlord_id FROM listings WHERE id = ?", [listingId]);
    if (!listing) {
      return res.status(404).json({ error: "NotFound", message: "Listing not found" });
    }

    // Landlord cannot review their own listing
    if (listing.landlord_id === reviewerId) {
      return res.status(400).json({
        error: "InvalidAction",
        message: "Landlords cannot review their own property",
      });
    }

    // 2. Enforce one review per user per listing
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

    // 3. Check if user has an accepted request or interaction
    const [acceptedRequest] = await query(
      "SELECT id FROM requests WHERE sender_id = ? AND listing_id = ? AND status = 'accepted'",
      [reviewerId, listingId]
    );

    const isVerifiedTenant = Boolean(acceptedRequest);

    const reviewId = `rev_${crypto.randomUUID().slice(0, 8)}`;
    await query(
      "INSERT INTO reviews (id, listing_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [reviewId, listingId, reviewerId, rating, comment]
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      reviewId,
      verifiedTenant: isVerifiedTenant,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to submit review", message: error.message });
  }
});

// ── GET /api/listings/:id/reviews (Fetch all reviews for a listing) ──────────
router.get("/", async (req, res) => {
  try {
    const listingId = req.params.id || req.query.listingId;
    if (!listingId) {
      return res.status(400).json({ error: "ValidationError", message: "listingId is required" });
    }

    const reviews = await query(
      `
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at AS createdAt,
        u.id AS reviewerId,
        u.name AS reviewerName
      FROM reviews r
      JOIN user u ON r.reviewer_id = u.id
      WHERE r.listing_id = ?
      ORDER BY r.created_at DESC
    `,
      [listingId]
    );

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews", message: error.message });
  }
});

export default router;
