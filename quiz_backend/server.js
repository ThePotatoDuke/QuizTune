// Importing required modules
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
      'SELECT score FROM "User" WHERE name = $1',
      [name]
    );

    if (existingUser.rows.length > 0) {
      // If the user exists, return their score
      return res.status(200).json({
        message: "User already exists",
        user: { name, score: existingUser.rows[0].score },
      });
    }

    // If the user doesn't exist, create a new record with default points
    const newUser = await pool.query(
      'INSERT INTO "User" (name, score) VALUES ($1, $2) RETURNING *',
      [name, 0] // Default points for new users
    );

    res.status(201).json({
      message: "User added successfully",
      user: { name: newUser.rows[0].name, score: newUser.rows[0].score },
    });
  } catch (error) {
    console.error("Error in /api/addUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user score
app.put("/api/updateScore", async (req, res) => {
  const { name, points } = req.body;

  if (!name || points == null) {
    return res.status(400).json({ error: "Name and points are required" });
  }

  try {
    const updatedUser = await pool.query(
      'UPDATE "User" SET score = $1 WHERE name = $2 RETURNING *',
      [points, name]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Score updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/questions", async (req, res) => {
  const { questions, userName } = req.body; // Expect an array of question objects

  if (!Array.isArray(questions)) {
    return res
      .status(400)
      .json({ error: "Input should be an array of questions" });
  }
  try {
    const results = [];

    // Query to get the user_id from the User table using the user name
    const userResult = await pool.query(
      `SELECT id FROM "User" WHERE name = $1`,
      [userName]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: `User '${userName}' not found` });
    }

    const user_id = userResult.rows[0].id;

    const quizCtrResult = await pool.query(
      `SELECT COUNT(*) AS quiz_count FROM "Quiz" WHERE user_id = $1`,
      [user_id]
    );

    const quizCtrCount = parseInt(quizCtrResult.rows[0].quiz_count, 10);

    const quizResult = await pool.query(
      `INSERT INTO "Quiz" (name, user_id) 
		VALUES ($1, $2) RETURNING id`,
      [`Quiz ${quizCtrCount + 1}`, user_id]
    );

    // Extract the quiz_id
    const quiz_id = quizResult.rows[0].id; // Ensure there is at least one row in the result

    for (const question of questions) {
      const {
        text,
        category,
        choices,
        correctIndex,
        userAnswerIndex = null,
      } = question;

      // Validation for each question
      if (
        !text ||
        !category ||
        !Array.isArray(choices) ||
        typeof correctIndex !== "number" ||
        !userName
      ) {
        return res.status(400).json({ error: "Invalid question format" });
      }

      // Query to get the category_id from the Category table using the category name
      const categoryResult = await pool.query(
        `SELECT id FROM "Category" WHERE name = $1`,
        [category]
      );

      if (categoryResult.rows.length === 0) {
        return res
          .status(400)
          .json({ error: `Category '${category}' not found` });
      }

      const category_id = categoryResult.rows[0].id;

      const result = await pool.query(
        `INSERT INTO "Question" ( text, category_id, choices, correct_index, user_answer_index, quiz_id) 
		   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          text,
          category_id,
          choices,
          correctIndex,
          userAnswerIndex,
          quiz_id, // Use the extracted quiz_id here
        ]
      );

      results.push(result.rows[0]); // Collect the inserted question
    }

    res.json(results); // Return all inserted questions
  } catch (err) {
    console.error("Error inserting questions:", err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/quiz/:userName", async (req, res) => {
  const { userName } = req.params;

  try {
    const userResult = await pool.query(
      'SELECT id FROM "User" WHERE name = $1',
      [userName]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: `User '${userName}' not found` });
    }

    const user_id = userResult.rows[0].id;

    const result = await pool.query('SELECT * FROM "Quiz" WHERE user_id = $1', [
      user_id,
    ]);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res
        .status(404)
        .json({ message: `No quizzes found for user '${userName}'` });
    }
  } catch (err) {
    console.error("Error fetching quizzes for user:", err.message);
    res.status(500).send("Server error");
  }
});

// Get all users or filter by name
app.get("/api/users", async (req, res) => {
  const { name } = req.query;

  try {
    let result;
    if (name) {
      result = await pool.query('SELECT * FROM "User" WHERE name = $1', [name]);
    } else {
      result = await pool.query('SELECT * FROM "User"');
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get questions of quiz
app.get("/api/quiz/:quizId/questions", async (req, res) => {
  const { quizId } = req.params;

  try {
    // Query to get all questions related to the quiz using quiz_id
    const result = await pool.query(
      'SELECT * FROM "Question" WHERE quiz_id = $1',
      [quizId]
    );

    if (result.rows.length > 0) {
      // Return all questions for the quiz
      res.json(result.rows);
    } else {
      // If no questions are found for the quiz
      res
        .status(404)
        .json({ message: `No questions found for quiz with id '${quizId}'` });
    }
  } catch (err) {
    console.error("Error fetching questions for quiz:", err.message);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// This guy gets all the answered questions form the DB
app.get("/api/answeredQuestions", async (req, res) => {
  try {
    // Does the ordering in a way where its shows the latest on top
    const result = await pool.query(
      `SELECT * FROM "Question" WHERE user_answer_index IS NOT NULL ORDER BY id DESC`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No answered questions found" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching answered questions:", err.message);
    res.status(500).send("Server error");
  }
});
