const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db"); // Import the database connection

const app = express();
const PORT = 5000;
console.log("Database User:", process.env.DB_USER); // Debugging line
console.log("Database Name:", process.env.DB_NAME); // Debugging line
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Quiz Backend is running!");
});

app.post("/api/addUser", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    // Check if the user exists
    const existingUser = await pool.query(
      'SELECT * FROM "User" WHERE "name" = $1',
      [name]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser.rows[0] });
    }

    // Insert new user with a default score of 0
    const newUser = await pool.query(
      'INSERT INTO "User" (name, score) VALUES ($1, $2) RETURNING *',
      [name, 0]
    );

    res
      .status(201)
      .json({ message: "User added successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all questions
app.get("/questions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Question");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a new question
app.post("/questions", async (req, res) => {
  const { text, category_id, choices, correct_index } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Question (text, category_id, choices, correct_index) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [text, category_id, choices, correct_index]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
