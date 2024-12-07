import { connectToDatabase } from "./dbConnection";
import * as sql from 'mssql';

// Function to retrieve all users from the database
export async function getAllUsers() {
  const pool = await connectToDatabase();

  try {
    const result = await pool.request().query(`SELECT * FROM Users`);
    console.log("Users retrieved successfully.");
    return result.recordset; // Returns an array of user records
  } catch (error) {
    console.error("Error retrieving users:", error);
  } finally {
    await pool.close();
  }
}

// Function to retrieve all tracks from the database
export async function getAllTracks() {
  const pool = await connectToDatabase();

  try {
    const result = await pool.request().query(`SELECT * FROM Tracks`);
    console.log("Tracks retrieved successfully.");
    return result.recordset; // Returns an array of track records
  } catch (error) {
    console.error("Error retrieving tracks:", error);
  } finally {
    await pool.close();
  }
}

// Function to find a user by their access token
export async function findUserByAccessToken(accessToken: string) {
  const pool = await connectToDatabase();

  try {
    const result = await pool.request()
      .input("accessToken", sql.NVarChar, accessToken)
      .query(`SELECT * FROM Users WHERE accessToken = @accessToken`);

    if (result.recordset.length > 0) {
      console.log("User found.");
      return result.recordset[0]; // Return the first match
    } else {
      console.log("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error finding user by access token:", error);
  } finally {
    await pool.close();
  }
}
