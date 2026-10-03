import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  const databaseUrl = process.env.DATABASE_URL || "mysql://root:@localhost/bashavara";
  const parsedUrl = new URL(databaseUrl.replace(/^mysql:\/\//, "http://"));
  const databaseName = parsedUrl.pathname.replace(/^\//, "") || "bashavara";

  console.log(`Connecting to MySQL database '${databaseName}'...`);

  try {
    const dbConnection = await mysql.createConnection({
      uri: databaseUrl,
      multipleStatements: true,
    });

    const seedPath = path.join(__dirname, "seed.sql");
    const seedSql = fs.readFileSync(seedPath, "utf-8");

    await dbConnection.query(seedSql);
    console.log("✓ Successfully applied seed data from seed.sql!");

    const [userCount] = await dbConnection.query("SELECT COUNT(*) as count FROM `user`");
    const [listingCount] = await dbConnection.query("SELECT COUNT(*) as count FROM `listings`");
    const [requestCount] = await dbConnection.query("SELECT COUNT(*) as count FROM `requests`");
    const [reviewCount] = await dbConnection.query("SELECT COUNT(*) as count FROM `reviews`");

    console.log(`- Users seeded: ${userCount[0].count}`);
    console.log(`- Listings seeded: ${listingCount[0].count}`);
    console.log(`- Requests seeded: ${requestCount[0].count}`);
    console.log(`- Reviews seeded: ${reviewCount[0].count}`);

    await dbConnection.end();
  } catch (error) {
    console.error("✗ Seeding failed:", error.message);
    process.exit(1);
  }
}

runSeed();
