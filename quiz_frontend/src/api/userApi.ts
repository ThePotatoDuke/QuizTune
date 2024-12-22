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

const getUserQuizzes = async (userName: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/quiz/${userName}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch quizzes for user: ${userName}`);
    }

    const quizzes = await response.json();
    console.log(`Quizzes for ${userName}:`, quizzes);

    return quizzes; // Return the quizzes for further use
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error; // Re-throw the error for higher-level handling
  }
};

export const getQuizQuestions = async (quizId: Number) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/quiz/${quizId}/questions`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch questions for quiz: ${quizId}`);
    }

    const questions = await response.json();
    console.log(`Questions for quiz ${quizId}:`, questions);

    return questions; // Return the questions for further use
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error; // Re-throw the error for higher-level handling
  }
};

export const getUserStats = async (userName: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000//api/stats/${userName}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stats for user: ${userName}`);
    }

    const stats = await response.json();
    console.log(`Stats for user ${userName}:`, stats);

    return stats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

// Default export for syncUserWithBackend
export default syncUserWithBackend;

// Named export for updateUserScore
export { updateUserScore, addQuestion, getUserQuizzes };
