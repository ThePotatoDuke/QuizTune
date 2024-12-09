import * as sql from 'mssql';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

console.log("Database configuration loaded.");

const dbConfig = {
  server: process.env.DB_SERVER as string,
  database: process.env.DB_DATABASE as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Convert to boolean
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', // Convert to boolean
  },
};

// Function to create a connection pool
export async function connectToDatabase() {
  try {
    console.log("Attempting to connect to the database...");
    const pool = await sql.connect(dbConfig);
    console.log("Database connected successfully!");
    return pool;
  } catch (error) {
    console.dir(error, { depth: null });
    if (error instanceof Error) {
      console.error("Database connection failed:", error.stack);
    } else {
      console.error("Database connection failed:", error);
    }
    throw error;
  }
}

// Function to close the database connection
export async function closeConnection(pool: sql.ConnectionPool) {
  try {
    await pool.close();
    console.log("Database connection closed.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error closing database connection:", error.stack);
    } else {
      console.error("Error closing database connection:", error);
    }
  }
}
