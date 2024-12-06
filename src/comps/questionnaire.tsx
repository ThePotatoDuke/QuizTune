import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  fetchFavoriteTracks,
  generateAnswerOptions,
  generateTrackQuestion,
} from "../utils/spotifyUtils";
import { useUser } from "../context/UserContext";

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10px;
  font-family: Arial, sans-serif;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
`;

const ImageContainer = styled.div`
  width: 400px;
  height: 400px;
  border: 3px dashed #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuestionText = styled.div`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const ChoicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const ChoiceButton = styled.button<{
  isCorrect?: boolean;
  isSelected?: boolean;
}>`
  background-color: ${({ isSelected, isCorrect }) =>
    isSelected ? (isCorrect ? "#4caf50" : "#e74c3c") : "#f9f9f9"};
  border: 2px solid #ccc;
  color: #000;
  padding: 10px;
  font-size: 1rem;
  cursor: ${({ isSelected }) => (isSelected ? "not-allowed" : "pointer")};
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? "" : "#ddd")};
  }

  img {
    width: 300px; /* Adjust the width as needed */
    height: 300px; /* Adjust the height as needed */
    object-fit: cover; /* This ensures the image covers the area without stretching */
    border-radius: 5px;
  }
`;

const ResultMessage = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #333;
`;

const ScoreBoard = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #333;
`;

const MenuButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

interface Question {
  text: string;
  choices: string[]; // Ensure choices are strings (image URLs)
  correctIndex: number;
  track?: any; // Optional: Track data if needed
}

const Questionnaire: React.FC = () => {
  const { user } = useUser(); // Get user data from context
  const [questions, setQuestions] = useState<Question[]>([]); // Will hold dynamically generated questions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const navigate = useNavigate();

  // Fetch favorite tracks and generate questions when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user?.accessToken) {
        console.error("No access token found!");
        return;
      }

      try {
        // Fetch the favorite tracks using the token
        let tracks = await fetchFavoriteTracks(user.accessToken);

        if (tracks.length === 0) {
          console.log("No favorite tracks found.");
          return;
        }
        tracks = [...tracks].sort(() => Math.random() - 0.5);

        // Generate questions from the fetched tracks
        const generatedQuestions: Question[] = await Promise.all(
          tracks.map(async (track) => {
            const { question, correctAnswer, questionType } =
              generateTrackQuestion(track); // Generate the question for the track

            // Generate answer options using the track data
            const answerOptions = generateAnswerOptions(
              correctAnswer,
              questionType,
              tracks
            ); // Assuming generateAnswerOptions can handle this

            // Map answer options to strings (if they are not already)
            const textOptions = answerOptions.map((option) => String(option));

            return {
              text: question,
              choices: textOptions, // Set the choices as text-only options (string[])
              correctIndex: textOptions.indexOf(String(correctAnswer)), // Ensure correctAnswer is a string
              track, // Optional: you can store the track data here for additional use
            };
          })
        );

        setQuestions(generatedQuestions); // Set the generated questions to the state
      } catch (error) {
        console.error("Error fetching tracks or generating questions:", error);
      }
    };

    fetchQuestions();
  }, [user?.accessToken]);

  const navToHome = () => {
    navigate("/home");
  };

  const handleChoiceClick = (index: number) => {
    if (selected !== null) return; // Prevent multiple selections
    setSelected(index);
    const correct = index === questions[currentQuestion].correctIndex;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 10); // Add 10 points for a correct answer
    }
  };

  const handleNextQuestion = () => {
    setSelected(null); // Reset selection
    setIsCorrect(null); // Reset correctness
    setCurrentQuestion((prev) => prev + 1); // Go to the next question
  };

  const isQuizOver = currentQuestion >= questions.length;

  return (
    <div>
      {isQuizOver ? (
        <div>
          <h1>Quiz Completed!</h1>
          <div>
            Your Score: {score} / {questions.length * 10}
          </div>
          <button onClick={navToHome}>Return to Menu</button>
        </div>
      ) : (
        <>
          <div>
            <h2>{questions[currentQuestion].text}</h2>

            <div>
              {questions[currentQuestion].choices.map((choice, index) => (
                <ChoiceButton
                  key={index}
                  onClick={() => handleChoiceClick(index)}
                  isSelected={selected === index}
                  isCorrect={index === questions[currentQuestion].correctIndex}
                >
                  <img src={choice} alt={`Choice ${index}`} />{" "}
                  {/* Display the image */}
                </ChoiceButton>
              ))}
            </div>

            {selected !== null && (
              <>
                <div>{isCorrect ? "Correct!" : "Wrong!"}</div>
                <button onClick={handleNextQuestion}>Next Question</button>
              </>
            )}
            <div>Score: {score}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Questionnaire;
