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

// Get all questions or filter by text
app.get("api/questions", async (req, res) => {
	const { text } = req.query;

	try {
		let result;
		if (text) {
			result = await pool.query('SELECT * FROM "Question" WHERE text LIKE $1', [
				`%${text}%`,
		]);
		} else {
			result = await pool.query("SELECT * FROM Question");
		}

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "No questions found" });
		}

		res.status(200).json(result.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Add a new question
app.post("/api/questions", async (req, res) => {
	const {
		text,
		category, // Category as a string
		choices,
		correctIndex,
		userName,
		userAnswerIndex = null, // Optional field, default to null
	} = req.body;

  try {
    // Query to get the category_id from the Category table using the category name
    const categoryResult = await pool.query(
		`SELECT id FROM "Category" WHERE name = $1`, // Find category by name
		[category]
    );

    if (categoryResult.rows.length === 0) {
      	return res.status(400).json({ error: "Category not found" });
    }

    const category_id = categoryResult.rows[0].id; // Get the category id

    // Query to get the user_id from the User table using the category name
    const userResult = await pool.query(
		`SELECT id FROM "User" WHERE name = $1`, // Find user by name
		[userName]
    );

    if (userResult.rows.length === 0) {
      	return res.status(400).json({ error: "User not found" });
    }

    const user_id = userResult.rows[0].id; // Get the category id

    // Insert the new question into the Question table
    const result = await pool.query(
		`INSERT INTO "Question" (user_id, text, category_id, choices, correct_index, user_answer_index) 
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
		[user_id, text, category_id, choices, correctIndex, userAnswerIndex]
    );

		res.json(result.rows[0]); // Return the inserted question
	} catch (err) {
		console.error("Error inserting question:", err.message);
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

// Start the server
app.listen(PORT, () => {
  	console.log(`Server is running on http://localhost:${PORT}`);
});

// This guy gets all the answered questions form the DB
app.get("/api/answeredQuestions", async (req, res) => {
	try {
		const result = await pool.query(
		`SELECT * FROM "Question" WHERE user_answer_index IS NOT NULL`
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
