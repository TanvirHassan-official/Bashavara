import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";

const router = Router();

// ── Database Query Helper ────────────────────────────────────────────────────
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ── Validation Schema ────────────────────────────────────────────────────────
const profileSchema = z.object({
  budget: z.coerce.number().int().positive("Budget must be a positive number"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  sleepSchedule: z.enum(["Early Bird", "Night Owl", "Flexible"]).default("Flexible"),
  smokingPreference: z.enum(["Non-Smoker", "Smoker", "Outside Only"]).default("Non-Smoker"),
  bio: z.string().optional().default(""),
});

// ── 1. GET /api/roommates (Other students, excluding yourself) ──────────────
router.get("/", async (req, res) => {
  try {
    // Optionally resolve session if cookie is present, without throwing 401
    let currentUserId = null;
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (session?.user) {
        currentUserId = session.user.id;
      }
    } catch {
      // Unauthenticated visitor
    }

    const { department, budgetMax, sleepSchedule, smokingPreference } = req.query;

    let conditions = ["u.role = 'student'"];
    let params = [];

    // Exclude current logged-in student
    if (currentUserId) {
      conditions.push("u.id != ?");
      params.push(currentUserId);
    }

    if (department && department !== "Any") {
      conditions.push("rp.department = ?");
      params.push(department);
    }

    if (budgetMax) {
      conditions.push("rp.budget <= ?");
      params.push(Number(budgetMax));
    }

    if (sleepSchedule && sleepSchedule !== "Any") {
      conditions.push("rp.sleep_schedule = ?");
      params.push(sleepSchedule);
    }

    if (smokingPreference && smokingPreference !== "Any") {
      conditions.push("rp.smoking_preference = ?");
      params.push(smokingPreference);
    }

    const sql = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.image,
        COALESCE(rp.budget, 1000) AS budget,
        COALESCE(rp.department, 'Undeclared') AS department,
        COALESCE(rp.sleep_schedule, 'Flexible') AS sleepSchedule,
        COALESCE(rp.smoking_preference, 'Non-Smoker') AS smokingPreference,
        COALESCE(rp.bio, '') AS bio,
        rp.updated_at AS updatedAt
      FROM user u
      LEFT JOIN roommate_profiles rp ON u.id = rp.user_id
      WHERE ${conditions.join(" AND ")}
      ORDER BY rp.updated_at DESC, u.createdAt DESC
    `;

    const roommates = await query(sql, params);

    res.json({
      success: true,
      count: roommates.length,
      roommates: roommates.map((r) => ({
        ...r,
        budget: Number(r.budget),
      })),
    });
  } catch (error) {
    console.error("Error fetching roommates:", error);
    res.status(500).json({ error: "Failed to fetch roommates", message: error.message });
  }
});

// ── 2. GET /api/me/profile (Preferences & profile for current user) ──────────
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.phone,
        u.businessName,
        COALESCE(rp.budget, 1000) AS budget,
        COALESCE(rp.department, 'Computer Science') AS department,
        COALESCE(rp.sleep_schedule, 'Flexible') AS sleepSchedule,
        COALESCE(rp.smoking_preference, 'Non-Smoker') AS smokingPreference,
        COALESCE(rp.bio, '') AS bio
      FROM user u
      LEFT JOIN roommate_profiles rp ON u.id = rp.user_id
      WHERE u.id = ?
    `;

    const [profile] = await query(sql, [userId]);

    if (!profile) {
      return res.status(404).json({ error: "NotFound", message: "User not found" });
    }

    res.json({
      success: true,
      profile: {
        ...profile,
        budget: Number(profile.budget),
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch profile", message: error.message });
  }
});

// ── 3. PUT /api/me/profile (Upsert preferences for current user) ─────────────
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const parseResult = profileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "ValidationError",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const userId = req.user.id;
    const { budget, department, sleepSchedule, smokingPreference, bio } = parseResult.data;

    const upsertSql = `
      INSERT INTO roommate_profiles (user_id, budget, department, sleep_schedule, smoking_preference, bio)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        budget = VALUES(budget),
        department = VALUES(department),
        sleep_schedule = VALUES(sleep_schedule),
        smoking_preference = VALUES(smoking_preference),
        bio = VALUES(bio),
        updated_at = CURRENT_TIMESTAMP
    `;

    await query(upsertSql, [
      userId,
      budget,
      department,
      sleepSchedule,
      smokingPreference,
      bio,
    ]);

    res.json({
      success: true,
      message: "Roommate preferences updated successfully",
      profile: {
        userId,
        budget,
        department,
        sleepSchedule,
        smokingPreference,
        bio,
      },
    });
  } catch (error) {
    console.error("Error updating roommate profile:", error);
    res.status(500).json({ error: "Failed to update profile", message: error.message });
  }
});

export default router;
