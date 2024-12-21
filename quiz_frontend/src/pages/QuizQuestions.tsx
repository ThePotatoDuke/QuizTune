import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the quizId
import { getQuizQuestions } from "../api/userApi";
// Define this function for fetching questions

interface Question {
  id: number;
  text: string;
  // Add other question properties
}

const QuizQuestions: React.FC = () => {
  const { quizId } = useParams(); // Get quizId from URL
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizId) {
        setError("Quiz ID is missing.");
        return;
      }

      try {
        const data = await getQuizQuestions(Number(quizId)); // Fetch questions by quizId
        setQuestions(data);
      } catch (err: any) {
        setError("Failed to fetch questions.");
      }
    };

    fetchQuestions();
  }, [quizId]); // Re-run effect when quizId changes

  return (
    <div>
      <h2>Questions for Quiz {quizId}</h2>
      {error && <div>{error}</div>}
      <ul>
        {questions.length > 0 ? (
          questions.map((question) => (
            <li key={question.id}>{question.text}</li>
          ))
        ) : (
          <p>No questions found for this quiz.</p>
        )}
      </ul>
    </div>
  );
};

export default QuizQuestions;
