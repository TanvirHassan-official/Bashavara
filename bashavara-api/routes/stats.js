import { Router } from "express";
import { pool } from "../db.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

// ── Database Query Helper ────────────────────────────────────────────────────
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ── 1. GET /api/stats (Public platform statistics) ───────────────────────────
router.get("/", async (_req, res) => {
  try {
    const [listingsStat] = await query(
      "SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active FROM listings"
    );

    const [usersStat] = await query(
      "SELECT SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) AS students, SUM(CASE WHEN role = 'landlord' THEN 1 ELSE 0 END) AS landlords FROM user"
    );

    const [reviewsStat] = await query(
      "SELECT COUNT(*) AS total, COALESCE(AVG(rating), 4.8) AS avgRating FROM reviews"
    );

    const [requestsStat] = await query(
      "SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS matches FROM requests"
    );

    res.json({
      success: true,
      stats: {
        activeListings: Number(listingsStat.active || 0),
        totalListings: Number(listingsStat.total || 0),
        verifiedStudents: Number(usersStat.students || 0),
        verifiedLandlords: Number(usersStat.landlords || 0),
        averageRating: Number(Number(reviewsStat.avgRating || 4.8).toFixed(1)),
        totalReviews: Number(reviewsStat.total || 0),
        successfulMatches: Number(requestsStat.matches || 0),
        totalRequests: Number(requestsStat.total || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats", message: error.message });
  }
});

// ── 2. GET /api/stats/landlord (Landlord specific metrics) ───────────────────
router.get("/landlord", requireRole("landlord"), async (req, res) => {
  try {
    const landlordId = req.user.id;

    const [listingStats] = await query(
      `
      SELECT 
        COUNT(*) AS totalListings,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeListings,
        SUM(CASE WHEN status = 'rented' THEN 1 ELSE 0 END) AS rentedListings
      FROM listings 
      WHERE landlord_id = ?
    `,
      [landlordId]
    );

    const [requestStats] = await query(
      `
      SELECT 
        COUNT(*) AS totalApplications,
        SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN r.status = 'accepted' THEN 1 ELSE 0 END) AS acceptedCount,
        SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END) AS rejectedCount
      FROM requests r
      WHERE r.receiver_id = ?
    `,
      [landlordId]
    );

    res.json({
      success: true,
      stats: {
        totalListings: Number(listingStats.totalListings || 0),
        activeListings: Number(listingStats.activeListings || 0),
        rentedListings: Number(listingStats.rentedListings || 0),
        totalApplications: Number(requestStats.totalApplications || 0),
        pendingApplications: Number(requestStats.pendingCount || 0),
        acceptedApplications: Number(requestStats.acceptedCount || 0),
        rejectedApplications: Number(requestStats.rejectedCount || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching landlord stats:", error);
    res.status(500).json({ error: "Failed to fetch landlord stats", message: error.message });
  }
});

export default router;
