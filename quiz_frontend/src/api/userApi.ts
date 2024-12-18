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
interface Question {
  text: string;
  choices: string[];
  correctIndex: number;
  category: string;
  userAnswerIndex?: number | null;
}
const addQuestion = async (questions: Question[], userName: string) => {
  try {
    const response = await fetch("http://localhost:5000/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questions, userName }), // Send the array directly
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Questions added successfully:", result);
    } else {
      console.error("Failed to add questions:", await response.text());
    }
  } catch (error) {
    console.error("Error adding questions:", error);
  }
};

// Default export for syncUserWithBackend
export default syncUserWithBackend;

// Named export for updateUserScore
export { updateUserScore, addQuestion };
