import { connectToDatabase } from "./dbConnection";
import * as sql from 'mssql';

// Function to insert user data into the database
export async function insertUserData(user: { name: string; avatar: string; points: number; accessToken: string | null }) {
  const pool = await connectToDatabase();

  try {
    await pool.request()
      .input("name", sql.NVarChar, user.name)
      .input("avatar", sql.NVarChar, user.avatar)
      .input("points", sql.Int, user.points)
      .input("accessToken", sql.NVarChar, user.accessToken)
      .query(`INSERT INTO Users (name, avatar, points, accessToken) VALUES (@name, @avatar, @points, @accessToken)`);

    console.log("User data inserted successfully.");
  } catch (error) {
    console.error("Error inserting user data:", error);
  } finally {
    await pool.close();
  }
}

// Function to insert track data into the database
export async function insertTrackData(track: { name: string; artist: string; releaseDate: string; albumCoverUrl: string; popularity: number }) {
  const pool = await connectToDatabase();

  try {
    await pool.request()
      .input("name", sql.NVarChar, track.name)
      .input("artist", sql.NVarChar, track.artist)
      .input("releaseDate", sql.Date, track.releaseDate)
      .input("albumCoverUrl", sql.NVarChar, track.albumCoverUrl)
      .input("popularity", sql.Int, track.popularity)
      .query(`INSERT INTO Tracks (name, artist, releaseDate, albumCoverUrl, popularity) VALUES (@name, @artist, @releaseDate, @albumCoverUrl, @popularity)`);

    console.log("Track data inserted successfully.");
  } catch (error) {
    console.error("Error inserting track data:", error);
  } finally {
    await pool.close();
  }
}
