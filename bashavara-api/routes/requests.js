import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ── Database Query Helper ────────────────────────────────────────────────────
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ── Validation Schemas ───────────────────────────────────────────────────────
const createRequestSchema = z.object({
  receiverId: z.string().min(1, "receiverId is required"),
  listingId: z.string().optional().nullable(),
  type: z.enum(["listing", "roommate"]),
  message: z.string().optional().default(""),
});

const updateStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "declined", "pending"]),
});

// ── 1. POST /api/requests (Create inquiry or roommate invite) ────────────────
router.post("/", requireAuth, async (req, res) => {
  try {
    const parseResult = createRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "ValidationError",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { receiverId, listingId, type, message } = parseResult.data;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        error: "InvalidRequest",
        message: "You cannot send a request to yourself",
      });
    }

    // Verify receiver exists
    const [receiver] = await query("SELECT id FROM user WHERE id = ?", [receiverId]);
    if (!receiver) {
      return res.status(404).json({ error: "NotFound", message: "Receiver user not found" });
    }

    // If listing request, verify listing exists
    if (type === "listing" && listingId) {
      const [listing] = await query("SELECT id FROM listings WHERE id = ?", [listingId]);
      if (!listing) {
        return res.status(404).json({ error: "NotFound", message: "Listing not found" });
      }
    }

    const requestId = `req_${crypto.randomUUID().slice(0, 8)}`;
    const insertSql = `
      INSERT INTO requests (id, sender_id, receiver_id, listing_id, type, status, message)
      VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `;

    await query(insertSql, [
      requestId,
      senderId,
      receiverId,
      listingId || null,
      type,
      message,
    ]);

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

// ── 2. GET /api/requests/incoming (Received requests) ────────────────────────
// Returns sender's email ONLY if status is 'accepted'
router.get("/incoming", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        r.id,
        r.sender_id AS senderId,
        u.name AS senderName,
        u.role AS senderRole,
        u.phone AS senderPhone,
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

    const requests = await query(sql, [userId]);

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    res.status(500).json({ error: "Failed to fetch incoming requests", message: error.message });
  }
});

// ── 3. GET /api/requests/outgoing (Sent requests) ────────────────────────────
// Returns receiver's email ONLY if status is 'accepted'
router.get("/outgoing", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        r.id,
        r.sender_id AS senderId,
        r.receiver_id AS receiverId,
        u.name AS receiverName,
        u.role AS receiverRole,
        u.businessName AS receiverBusinessName,
        u.phone AS receiverPhone,
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

    const requests = await query(sql, [userId]);

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error fetching outgoing requests:", error);
    res.status(500).json({ error: "Failed to fetch outgoing requests", message: error.message });
  }
});

// ── 4. PATCH /api/requests/:id (Receiver only: Accept or Decline) ────────────
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

    // Verify receiver ownership
    const [existing] = await query(
      "SELECT id, sender_id, receiver_id, status FROM requests WHERE id = ?",
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

    let status = parseResult.data.status;
    if (status === "declined") status = "rejected";

    await query("UPDATE requests SET status = ? WHERE id = ?", [status, id]);

    // Fetch updated request with unlocked email if accepted
    const [updated] = await query(
      `
      SELECT 
        r.id,
        r.sender_id AS senderId,
        u.name AS senderName,
        u.phone AS senderPhone,
        CASE WHEN r.status = 'accepted' THEN u.email ELSE NULL END AS senderEmail,
        r.status,
        r.updated_at AS updatedAt
      FROM requests r
      JOIN user u ON r.sender_id = u.id
      WHERE r.id = ?
    `,
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
