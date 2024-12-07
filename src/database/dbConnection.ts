import * as sql from 'mssql';

console.log("hiii");
// Configuration for connecting to your database
const dbConfig = {
  server: 'DESKTOP-FCAH7OP\\MSSQLSERVER01', // or your server's address
  database: 'seng429',
  options: {
    encrypt: false, // Use true if connecting to an Azure database
    trustServerCertificate: true, 
  },
};

// Function to create a connection pool
export async function connectToDatabase() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Database connected successfully!");
    return pool;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

// Function to close the database connection
export async function closeConnection(pool: sql.ConnectionPool) {
  try {
    await pool.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}
