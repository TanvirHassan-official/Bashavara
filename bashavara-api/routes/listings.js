import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { pool } from "../db.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

// ── Database Query Helper ────────────────────────────────────────────────────
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ── Validation Schemas ───────────────────────────────────────────────────────
const createListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rent: z.coerce.number().positive("Rent must be a positive number"),
  utilityCharge: z.coerce.number().min(0).default(0),
  distance: z.string().optional().default(""),
  bedrooms: z.coerce.number().int().min(0).default(1),
  bathrooms: z.coerce.number().int().min(1).default(1),
  departmentRelevance: z.string().optional().default("Any"),
  photoUrl: z.string().url("Invalid photo URL").optional().or(z.literal("")),
  availableFrom: z.string().optional().default("Immediately"),
  status: z.enum(["active", "paused", "rented"]).default("active"),
  amenities: z.array(z.string()).optional().default([]),
});

const updateListingSchema = createListingSchema.partial();

const updateStatusSchema = z.object({
  status: z.enum(["active", "paused", "rented"]),
});

// ── 1. GET /api/listings (Public with filters & sort) ─────────────────────────
router.get("/", async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      department,
      status = "active",
      landlordId,
      sort = "newest",
    } = req.query;

    let conditions = ["1=1"];
    let params = [];

    // Only filter by status if not specified as 'all'
    if (status && status !== "all") {
      conditions.push("l.status = ?");
      params.push(status);
    }

    if (landlordId) {
      conditions.push("l.landlord_id = ?");
      params.push(landlordId);
    }

    if (search) {
      conditions.push("(l.title LIKE ? OR l.address LIKE ? OR l.description LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (minPrice) {
      conditions.push("l.rent >= ?");
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      conditions.push("l.rent <= ?");
      params.push(Number(maxPrice));
    }

    if (bedrooms) {
      conditions.push("l.bedrooms = ?");
      params.push(Number(bedrooms));
    }

    if (bathrooms) {
      conditions.push("l.bathrooms >= ?");
      params.push(Number(bathrooms));
    }

    if (department && department !== "Any") {
      conditions.push("(l.department_relevance = ? OR l.department_relevance = 'Any')");
      params.push(department);
    }

    // Sorting
    let orderBy = "l.created_at DESC";
    if (sort === "price_asc") orderBy = "l.rent ASC";
    else if (sort === "price_desc") orderBy = "l.rent DESC";
    else if (sort === "distance_asc") orderBy = "CAST(l.distance AS DECIMAL(10,2)) ASC";
    else if (sort === "rating_desc") orderBy = "avg_rating DESC";

    const sql = `
      SELECT 
        l.id,
        l.landlord_id AS landlordId,
        u.name AS posterName,
        u.businessName,
        l.title,
        l.address,
        l.description,
        l.rent,
        l.utility_charge AS utilityCharge,
        l.distance,
        l.bedrooms,
        l.bathrooms,
        l.department_relevance AS departmentRelevance,
        l.photo_url AS photoUrl,
        l.available_from AS availableFrom,
        l.status,
        l.created_at AS createdAt,
        COALESCE(AVG(r.rating), 0) AS avgRating,
        COUNT(DISTINCT r.id) AS reviewCount,
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(la.amenity)
            FROM listing_amenities la
            WHERE la.listing_id = l.id
          ),
          JSON_ARRAY()
        ) AS amenities
      FROM listings l
      JOIN user u ON l.landlord_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE ${conditions.join(" AND ")}
      GROUP BY l.id
      ORDER BY ${orderBy}
    `;

    const listings = await query(sql, params);

    res.json({
      success: true,
      count: listings.length,
      listings: listings.map((l) => ({
        ...l,
        rent: Number(l.rent),
        utilityCharge: Number(l.utilityCharge),
        avgRating: Number(Number(l.avgRating).toFixed(1)),
        reviewCount: Number(l.reviewCount),
        amenities: Array.isArray(l.amenities) ? l.amenities : JSON.parse(l.amenities || "[]"),
      })),
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings", message: error.message });
  }
});

// ── 2. GET /api/listings/:id (Detail with reviews & avg rating) ──────────────
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const listingSql = `
      SELECT 
        l.id,
        l.landlord_id AS landlordId,
        u.name AS posterName,
        u.businessName,
        u.email AS landlordEmail,
        u.phone AS landlordPhone,
        l.title,
        l.address,
        l.description,
        l.rent,
        l.utility_charge AS utilityCharge,
        l.distance,
        l.bedrooms,
        l.bathrooms,
        l.department_relevance AS departmentRelevance,
        l.photo_url AS photoUrl,
        l.available_from AS availableFrom,
        l.status,
        l.created_at AS createdAt,
        COALESCE(AVG(r.rating), 0) AS avgRating,
        COUNT(DISTINCT r.id) AS reviewCount,
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(la.amenity)
            FROM listing_amenities la
            WHERE la.listing_id = l.id
          ),
          JSON_ARRAY()
        ) AS amenities
      FROM listings l
      JOIN user u ON l.landlord_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.id = ?
      GROUP BY l.id
    `;

    const [listing] = await query(listingSql, [id]);

    if (!listing) {
      return res.status(404).json({ error: "NotFound", message: "Listing not found" });
    }

    // Fetch reviews for this listing
    const reviewsSql = `
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
    `;
    const reviews = await query(reviewsSql, [id]);

    res.json({
      success: true,
      listing: {
        ...listing,
        rent: Number(listing.rent),
        utilityCharge: Number(listing.utilityCharge),
        avgRating: Number(Number(listing.avgRating).toFixed(1)),
        reviewCount: Number(listing.reviewCount),
        amenities: Array.isArray(listing.amenities)
          ? listing.amenities
          : JSON.parse(listing.amenities || "[]"),
        reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching listing detail:", error);
    res.status(500).json({ error: "Failed to fetch listing detail", message: error.message });
  }
});

// ── 3. POST /api/listings (Landlord only) ────────────────────────────────────
router.post("/", requireRole("landlord"), async (req, res) => {
  try {
    const parseResult = createListingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "ValidationError",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const data = parseResult.data;
    const listingId = `l_${crypto.randomUUID().slice(0, 8)}`;
    const landlordId = req.user.id;

    const insertSql = `
      INSERT INTO listings (
        id, landlord_id, title, address, description, rent, utility_charge,
        distance, bedrooms, bathrooms, department_relevance, photo_url,
        available_from, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(insertSql, [
      listingId,
      landlordId,
      data.title,
      data.address,
      data.description,
      data.rent,
      data.utilityCharge,
      data.distance,
      data.bedrooms,
      data.bathrooms,
      data.departmentRelevance,
      data.photoUrl || "",
      data.availableFrom,
      data.status,
    ]);

    // Insert amenities if provided
    if (data.amenities && data.amenities.length > 0) {
      for (const amenity of data.amenities) {
        await query(
          "INSERT IGNORE INTO listing_amenities (listing_id, amenity) VALUES (?, ?)",
          [listingId, amenity]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listingId,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ error: "Failed to create listing", message: error.message });
  }
});

// ── 4. PATCH /api/listings/:id (Landlord only — Ownership verified) ─────────
router.patch("/:id", requireRole("landlord"), async (req, res) => {
  try {
    const { id } = req.params;
    const landlordId = req.user.id;

    // Ownership check
    const [existing] = await query(
      "SELECT id FROM listings WHERE id = ? AND landlord_id = ?",
      [id, landlordId]
    );

    if (!existing) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only update your own listings",
      });
    }

    const parseResult = updateListingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "ValidationError",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const data = parseResult.data;
    const updateFields = [];
    const updateParams = [];

    const fieldMap = {
      title: "title",
      address: "address",
      description: "description",
      rent: "rent",
      utilityCharge: "utility_charge",
      distance: "distance",
      bedrooms: "bedrooms",
      bathrooms: "bathrooms",
      departmentRelevance: "department_relevance",
      photoUrl: "photo_url",
      availableFrom: "available_from",
      status: "status",
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        updateFields.push(`${col} = ?`);
        updateParams.push(data[key]);
      }
    }

    if (updateFields.length > 0) {
      updateParams.push(id, landlordId);
      await query(
        `UPDATE listings SET ${updateFields.join(", ")} WHERE id = ? AND landlord_id = ?`,
        updateParams
      );
    }

    // Update amenities if provided
    if (data.amenities !== undefined) {
      await query("DELETE FROM listing_amenities WHERE listing_id = ?", [id]);
      for (const amenity of data.amenities) {
        await query(
          "INSERT INTO listing_amenities (listing_id, amenity) VALUES (?, ?)",
          [id, amenity]
        );
      }
    }

    res.json({
      success: true,
      message: "Listing updated successfully",
      listingId: id,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ error: "Failed to update listing", message: error.message });
  }
});

// ── 5. PATCH /api/listings/:id/status (Landlord only — Status toggle) ────────
router.patch("/:id/status", requireRole("landlord"), async (req, res) => {
  try {
    const { id } = req.params;
    const landlordId = req.user.id;

    // Ownership check
    const [existing] = await query(
      "SELECT id FROM listings WHERE id = ? AND landlord_id = ?",
      [id, landlordId]
    );

    if (!existing) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only change the status of your own listings",
      });
    }

    const parseResult = updateStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "ValidationError",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    await query(
      "UPDATE listings SET status = ? WHERE id = ? AND landlord_id = ?",
      [parseResult.data.status, id, landlordId]
    );

    res.json({
      success: true,
      message: `Listing status updated to ${parseResult.data.status}`,
      status: parseResult.data.status,
    });
  } catch (error) {
    console.error("Error updating listing status:", error);
    res.status(500).json({ error: "Failed to update listing status", message: error.message });
  }
});

// ── 6. DELETE /api/listings/:id (Landlord only — Ownership verified) ────────
router.delete("/:id", requireRole("landlord"), async (req, res) => {
  try {
    const { id } = req.params;
    const landlordId = req.user.id;

    // Ownership check
    const [existing] = await query(
      "SELECT id FROM listings WHERE id = ? AND landlord_id = ?",
      [id, landlordId]
    );

    if (!existing) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only delete your own listings",
      });
    }

    await query("DELETE FROM listings WHERE id = ? AND landlord_id = ?", [
      id,
      landlordId,
    ]);

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ error: "Failed to delete listing", message: error.message });
  }
});

export default router;
