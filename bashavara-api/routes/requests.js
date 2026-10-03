import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { pool } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// ── Database Query Helper ────────────────────────────────────────────────────
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ── Validation Schemas ───────────────────────────────────────────────────────
const createRequestSchema = z.object({
  receiverId: z.string().min(1).optional().nullable(), // ignored for listing requests
  listingId: z.string().min(1).optional().nullable(),
  type: z.enum(["listing", "roommate"]),
  message: z.string().max(1000).optional().default(""),
});

// "pending" removed: a receiver can only accept or reject
const updateStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "declined"]),
});

// ── 1. POST /api/requests (students only) ────────────────────────────────────
router.post("/", requireRole("student"), async (req, res) => {
  try {
    const parseResult = createRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "ValidationError",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { listingId, type, message } = parseResult.data;
    const senderId = req.user.id;

    let receiverId;
    let resolvedListingId = null;

    if (type === "listing") {
      // The receiver is ALWAYS the listing's landlord. Never trust the client.
      if (!listingId) {
        return res.status(400).json({
          error: "ValidationError",
          message: "listingId is required for listing requests",
        });
      }

      const [listing] = await query(
        "SELECT id, landlord_id, status FROM listings WHERE id = ?",
        [listingId]
      );
      if (!listing) {
        return res.status(404).json({ error: "NotFound", message: "Listing not found" });
      }
      if (listing.status !== "active") {
        return res.status(400).json({
          error: "ListingUnavailable",
          message: "This listing is not accepting requests right now",
        });
      }

      receiverId = listing.landlord_id;
      resolvedListingId = listing.id;
    } else {
      // Roommate request: receiver must be another student, no listing attached
      receiverId = parseResult.data.receiverId;
      if (!receiverId) {
        return res.status(400).json({
          error: "ValidationError",
          message: "receiverId is required for roommate requests",
        });
      }

      const [receiver] = await query(
        "SELECT id, role FROM user WHERE id = ?",
        [receiverId]
      );
      if (!receiver) {
        return res.status(404).json({ error: "NotFound", message: "Receiver user not found" });
      }
      if (receiver.role !== "student") {
        return res.status(400).json({
          error: "InvalidRequest",
          message: "Roommate requests can only be sent to students",
        });
      }
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        error: "InvalidRequest",
        message: "You cannot send a request to yourself",
      });
    }

    // Block duplicates while a request is pending or accepted
    // (<=> is MySQL's NULL-safe equality, needed because roommate requests have listing_id = NULL)
    const [duplicate] = await query(
      `SELECT id FROM requests
       WHERE sender_id = ? AND receiver_id = ? AND type = ?
         AND listing_id <=> ? AND status IN ('pending', 'accepted')`,
      [senderId, receiverId, type, resolvedListingId]
    );
    if (duplicate) {
      return res.status(409).json({
        error: "DuplicateRequest",
        message: "You already have an active request for this",
      });
    }

    const requestId = `req_${crypto.randomUUID().slice(0, 8)}`;
    await query(
      `INSERT INTO requests (id, sender_id, receiver_id, listing_id, type, status, message)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      [requestId, senderId, receiverId, resolvedListingId, type, message]
    );

    res.status(201).json({
      success: true,
      message: "Request sent successfully",
      requestId,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Failed to send request", message: error.message });
  }
});

// ── 2. GET /api/requests/incoming ────────────────────────────────────────────
// Sender's email AND phone are returned ONLY when status is 'accepted'
router.get("/incoming", requireAuth, async (req, res) => {
  try {
    const sql = `
      SELECT
        r.id,
        r.sender_id AS senderId,
        u.name AS senderName,
        u.role AS senderRole,
        CASE WHEN r.status = 'accepted' THEN u.phone ELSE NULL END AS senderPhone,
        CASE WHEN r.status = 'accepted' THEN u.email ELSE NULL END AS senderEmail,
        r.receiver_id AS receiverId,
        r.listing_id AS listingId,
        l.title AS listingTitle,
        l.address AS listingAddress,
        r.type,
        r.status,
        r.message,
        r.created_at AS createdAt
      FROM requests r
      JOIN user u ON r.sender_id = u.id
      LEFT JOIN listings l ON r.listing_id = l.id
      WHERE r.receiver_id = ?
      ORDER BY r.created_at DESC
    `;

    const requests = await query(sql, [req.user.id]);
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    res.status(500).json({ error: "Failed to fetch incoming requests", message: error.message });
  }
});

// ── 3. GET /api/requests/outgoing ────────────────────────────────────────────
// Receiver's email AND phone are returned ONLY when status is 'accepted'
router.get("/outgoing", requireAuth, async (req, res) => {
  try {
    const sql = `
      SELECT
        r.id,
        r.sender_id AS senderId,
        r.receiver_id AS receiverId,
        u.name AS receiverName,
        u.role AS receiverRole,
        u.businessName AS receiverBusinessName,
        CASE WHEN r.status = 'accepted' THEN u.phone ELSE NULL END AS receiverPhone,
        CASE WHEN r.status = 'accepted' THEN u.email ELSE NULL END AS receiverEmail,
        r.listing_id AS listingId,
        l.title AS listingTitle,
        l.address AS listingAddress,
        r.type,
        r.status,
        r.message,
        r.created_at AS createdAt
      FROM requests r
      JOIN user u ON r.receiver_id = u.id
      LEFT JOIN listings l ON r.listing_id = l.id
      WHERE r.sender_id = ?
      ORDER BY r.created_at DESC
    `;

    const requests = await query(sql, [req.user.id]);
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    console.error("Error fetching outgoing requests:", error);
    res.status(500).json({ error: "Failed to fetch outgoing requests", message: error.message });
  }
});

// ── 4. PATCH /api/requests/:id (receiver only, pending -> accepted/rejected) ──
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const parseResult = updateStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "ValidationError",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const [existing] = await query(
      "SELECT id, receiver_id, status FROM requests WHERE id = ?",
      [id]
    );

    if (!existing) {
      return res.status(404).json({ error: "NotFound", message: "Request not found" });
    }

    if (existing.receiver_id !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only the recipient can respond to this request",
      });
    }

    // Decisions are final: only pending requests can be answered
    if (existing.status !== "pending") {
      return res.status(409).json({
        error: "AlreadyResolved",
        message: `This request was already ${existing.status}`,
      });
    }

    const status = parseResult.data.status === "declined" ? "rejected" : parseResult.data.status;

    // AND status = 'pending' guards against two simultaneous responses
    const [result] = await pool.query(
      "UPDATE requests SET status = ? WHERE id = ? AND receiver_id = ? AND status = 'pending'",
      [status, id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(409).json({
        error: "AlreadyResolved",
        message: "This request was already resolved",
      });
    }

    const [updated] = await query(
      `SELECT
         r.id,
         r.sender_id AS senderId,
         u.name AS senderName,
         CASE WHEN r.status = 'accepted' THEN u.phone ELSE NULL END AS senderPhone,
         CASE WHEN r.status = 'accepted' THEN u.email ELSE NULL END AS senderEmail,
         r.status,
         r.updated_at AS updatedAt
       FROM requests r
       JOIN user u ON r.sender_id = u.id
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
      request: updated,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Failed to update request status", message: error.message });
  }
});

export default router;