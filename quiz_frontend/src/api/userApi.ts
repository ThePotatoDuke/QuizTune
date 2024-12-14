import { useContext } from "react";
import { useUser } from "../context/UserContext";

const syncUserWithBackend = async (user: {
  name: string;
  points: number;
  avatar: string;
}) => {
  try {
    const response = await fetch("http://localhost:5000/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: user.name, score: user.points }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync user");
    }

    const data = await response.json();

    if (data.user) {
      console.log("User synced successfully:", data);
      return { ...user, points: data.user.score }; // Ensure avatar is retained
    }

    return user; // Return the original user if no backend data is available
  } catch (error) {
    console.error("Error syncing user with backend:", error);
    throw error;
  }
};

const updateUserScore = async (name: string, newScore: number) => {
  try {
    const response = await fetch("http://localhost:5000/api/updateScore", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, points: newScore }), // Pass name and new score
    });

    if (!response.ok) {
      throw new Error("Failed to update score");
    }

    const data = await response.json();
    console.log("Score updated successfully:", data);

    return data.user; // Return the updated user object
  } catch (error) {
    console.error("Error updating score:", error);
    throw error;
  }
};

const addQuestion = async (
  text: string,
  choices: string[],
  correctIndex: number,
  category: string, // Category name as a string
  userName: string, // Add userName explicitly
  userAnswerIndex?: number | null
) => {
  try {
    const response = await fetch("http://localhost:5000/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        category,
        choices,
        correctIndex,
        userName,
        userAnswerIndex,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Question added successfully:", result);
    } else {
      console.error("Failed to add question:", await response.text());
    }
  } catch (error) {
    console.error("Error adding question:", error);
  }
};

// Default export for syncUserWithBackend
export default syncUserWithBackend;

// Named export for updateUserScore
export { updateUserScore, addQuestion };
