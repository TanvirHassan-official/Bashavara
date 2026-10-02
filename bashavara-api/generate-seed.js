import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "..", "public", "data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

let sql = `-- =============================================================================\n-- BashaVara Database Seed Data (Converted from public/data.json)\n-- =============================================================================\n\nUSE \`bashavara\`;\n\nSET FOREIGN_KEY_CHECKS = 0;\nTRUNCATE TABLE \`reviews\`;\nTRUNCATE TABLE \`requests\`;\nTRUNCATE TABLE \`listing_amenities\`;\nTRUNCATE TABLE \`listings\`;\nTRUNCATE TABLE \`roommate_profiles\`;\nTRUNCATE TABLE \`account\`;\nTRUNCATE TABLE \`session\`;\nTRUNCATE TABLE \`user\`;\nSET FOREIGN_KEY_CHECKS = 1;\n\n`;

// 1. Users & Roommate Profiles
sql += `-- ── 1. Users & Roommate Profiles ─────────────────────────────────────────────\n`;
const allUsers = [data.currentUser, ...data.users];
for (const u of allUsers) {
  const name = u.name.replace(/'/g, "''");
  const email = u.email.replace(/'/g, "''");
  const dept = (u.department || "").replace(/'/g, "''");
  const bio = (u.bio || "").replace(/'/g, "''");
  sql += `INSERT INTO \`user\` (\`id\`, \`name\`, \`email\`, \`emailVerified\`, \`role\`) VALUES ('${u.id}', '${name}', '${email}', TRUE, 'student');\n`;
  sql += `INSERT INTO \`roommate_profiles\` (\`user_id\`, \`budget\`, \`department\`, \`sleep_schedule\`, \`smoking_preference\`, \`bio\`) VALUES ('${u.id}', ${u.budget}, '${dept}', '${u.sleepSchedule}', '${u.smokingPreference}', '${bio}');\n`;
}

// Landlord User
const ld = data.currentLandlord;
const ldName = ld.name.replace(/'/g, "''");
const ldBiz = (ld.businessName || "").replace(/'/g, "''");
sql += `\n-- Landlord User\nINSERT INTO \`user\` (\`id\`, \`name\`, \`email\`, \`emailVerified\`, \`role\`, \`phone\`, \`businessName\`) VALUES ('${ld.id}', '${ldName}', '${ld.email}', TRUE, 'landlord', '${ld.phone}', '${ldBiz}');\n\n`;

// 2. Listings & Amenities
sql += `-- ── 2. Listings & Listing Amenities ─────────────────────────────────────────\n`;
const allListings = [...data.landlordListings, ...data.listings];
for (const l of allListings) {
  const landlordId = l.userId;
  const status = l.listingStatus || "active";
  const distanceStr = typeof l.distance === "number" ? `${l.distance} mi` : (l.distance || "");
  const title = l.title.replace(/'/g, "''");
  const address = l.address.replace(/'/g, "''");
  const description = l.description.replace(/'/g, "''");
  const deptRel = (l.departmentRelevance || "Any").replace(/'/g, "''");
  const photoUrl = (l.photoUrl || "").replace(/'/g, "''");
  const availableFrom = (l.availableFrom || "").replace(/'/g, "''");

  sql += `INSERT INTO \`listings\` (\`id\`, \`landlord_id\`, \`title\`, \`address\`, \`description\`, \`rent\`, \`utility_charge\`, \`distance\`, \`bedrooms\`, \`bathrooms\`, \`department_relevance\`, \`photo_url\`, \`available_from\`, \`status\`) VALUES ('${l.id}', '${landlordId}', '${title}', '${address}', '${description}', ${l.rent}, ${l.utilityCharge || 0}, '${distanceStr}', ${l.bedrooms || 1}, ${l.bathrooms || 1}, '${deptRel}', '${photoUrl}', '${availableFrom}', '${status}');\n`;

  if (l.amenities && l.amenities.length > 0) {
    for (const a of l.amenities) {
      const amenity = a.replace(/'/g, "''");
      sql += `INSERT INTO \`listing_amenities\` (\`listing_id\`, \`amenity\`) VALUES ('${l.id}', '${amenity}');\n`;
    }
  }
}

// 3. Reviews
sql += `\n-- ── 3. Reviews ─────────────────────────────────────────────────────────────\n`;
for (const r of data.reviews) {
  const comment = (r.comment || "").replace(/'/g, "''");
  sql += `INSERT INTO \`reviews\` (\`id\`, \`listing_id\`, \`reviewer_id\`, \`rating\`, \`comment\`, \`created_at\`) VALUES ('${r.id}', '${r.listingId}', '${r.reviewerId}', ${r.rating}, '${comment}', '${r.createdAt} 00:00:00');\n`;
}

// 4. Unified Requests
sql += `\n-- ── 4. Requests (Unified Student & Landlord Requests) ───────────────────────\n`;
const allReqs = [...data.landlordRequests, ...data.requests];
for (const req of allReqs) {
  const listingIdVal = req.listingId ? `'${req.listingId}'` : "NULL";
  const status = req.status.toLowerCase();
  sql += `INSERT INTO \`requests\` (\`id\`, \`sender_id\`, \`receiver_id\`, \`listing_id\`, \`type\`, \`status\`, \`created_at\`) VALUES ('${req.id}', '${req.senderId}', '${req.receiverId}', ${listingIdVal}, '${req.type}', '${status}', '${req.createdAt} 00:00:00');\n`;
}

const outputPath = path.join(__dirname, "seed.sql");
fs.writeFileSync(outputPath, sql, "utf-8");
console.log(`✓ Successfully generated ${outputPath}`);
console.log(`- ${allUsers.length + 1} users with profiles`);
console.log(`- ${allListings.length} listings with amenities`);
console.log(`- ${data.reviews.length} reviews`);
console.log(`- ${allReqs.length} unified requests`);
