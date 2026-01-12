// Create the database if it doesn't exist
require("dotenv").config();
const { Client } = require("pg");

async function createDatabase() {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || 5432;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;
  const ssl = String(process.env.DB_SSL || "").toLowerCase() === "true";

  if (!host || !user || !password || !dbName) {
    throw new Error("Missing DB_HOST, DB_USER, DB_PASSWORD, or DB_NAME");
  }

  // Connect to 'postgres' database (default) to create our target database
  const client = new Client({
    host,
    port,
    user,
    password,
    database: "postgres", // Connect to default postgres database
    ssl: ssl ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log(`Connected to RDS at ${host}`);

    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (result.rows.length > 0) {
      console.log(`Database "${dbName}" already exists.`);
    } else {
      console.log(`Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    }
  } finally {
    await client.end();
  }
}

createDatabase()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
