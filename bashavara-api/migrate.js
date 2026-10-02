import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/bashavara";
  const parsedUrl = new URL(databaseUrl.replace(/^mysql:\/\//, "http://"));
  const databaseName = parsedUrl.pathname.replace(/^\//, "") || "bashavara";

  console.log(`Connecting to MySQL server at ${parsedUrl.hostname}:${parsedUrl.port || 3306}...`);

  try {
    // 1. Connect without specific DB to create DB if needed
    const rootConnection = await mysql.createConnection({
      host: parsedUrl.hostname,
      port: Number(parsedUrl.port) || 3306,
      user: parsedUrl.username,
      password: parsedUrl.password,
      multipleStatements: true,
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
    await rootConnection.end();

    // 2. Connect to database and execute schema.sql
    const dbConnection = await mysql.createConnection({
      uri: databaseUrl,
      multipleStatements: true,
    });

    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    await dbConnection.query(schemaSql);
    console.log("✓ Successfully created tables: `user`, `session`, `account`, `verification`");

    // Check tables in the database
    const [tables] = await dbConnection.query("SHOW TABLES");
    console.log("Existing tables in database:", tables);

    await dbConnection.end();
    console.log("✓ Migration completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    process.exit(1);
  }
}

runMigration();
