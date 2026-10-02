import "dotenv/config";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/bashavara";

export async function initDatabase() {
  try {
    const parsedUrl = new URL(databaseUrl.replace(/^mysql:\/\//, "http://"));
    const databaseName = parsedUrl.pathname.replace(/^\//, "") || "bashavara";

    // Connect to server (without database specified) to ensure database exists
    const rootConnection = await mysql.createConnection({
      host: parsedUrl.hostname,
      port: Number(parsedUrl.port) || 3306,
      user: parsedUrl.username,
      password: parsedUrl.password,
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
    await rootConnection.end();

    // Now test connection to the specific database
    const pool = mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const [rows] = await pool.query("SELECT 1 + 1 AS solution");
    console.log(`✓ MySQL connected successfully to '${databaseName}'. Test query result: ${rows[0].solution}`);
    return pool;
  } catch (error) {
    console.error("✗ MySQL connection error:", error);
    throw error;
  }
}

export const pool = mysql.createPool({
  uri: databaseUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Run directly when executing `node db.js`
if (process.argv[1] && process.argv[1].endsWith("db.js")) {
  initDatabase()
    .then(() => {
      console.log("Database initialized and verified.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Failed to initialize database:", err.message);
      process.exit(1);
    });
}
