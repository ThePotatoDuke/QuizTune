import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  fetchFavoriteTracks,
  generateAnswerOptions,
  generateTrackQuestion,
} from "../utils/spotifyUtils";
import { useUser } from "../context/UserContext";

const ChoiceButton = styled.button<{
  isCorrect?: boolean;
  isSelected?: boolean;
}>`
  background-color: ${({ isSelected, isCorrect }) =>
    isSelected ? (isCorrect ? "#4caf50" : "#e74c3c") : "#f9f9f9"};
  border: 1px solid #ccc;
  padding: 20px;
  font-size: 1rem;
  cursor: ${({ isSelected }) => (isSelected ? "not-allowed" : "pointer")};
  border-radius: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin:20px;

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
  font-size: 2rem;
  color: black
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
  choices: string[]; // Ensure choices are strings (image URLs or text)
  correctIndex: number;
  track?: any; // Optional: Track data if needed
  questionType: string; // Add the question type (e.g., 'album_cover', 'artist', etc.)
}

const Questionnaire: React.FC = () => {
  const { user } = useUser(); // Get user data from context
  const [questions, setQuestions] = useState<Question[]>([]); // Will hold dynamically generated questions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const maxQuestions = 3; 

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
        // With maxQuestion added
        const generatedQuestions: Question[] = await Promise.all(
          tracks.slice(0, maxQuestions).map(async (track) => {
            const { question, correctAnswer, questionType } =
              generateTrackQuestion(track);

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
              questionType, // Add the questionType here
            };
          })
        );

        // With maxQuestion added
        setQuestions(generatedQuestions.slice(0, maxQuestions));
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
          <ScoreBoard>
            Your Score: {score} / {questions.length * 10}
          </ScoreBoard>
          <MenuButton
          onClick={navToHome}>Return to Menu</MenuButton>
        </div>
      ) : (
        <>
          <div>
            <h1>{questions[currentQuestion].text}</h1>

            <div>
              {questions[currentQuestion].choices.map((choice, index) => (
                <ChoiceButton
                  key={index}
                  onClick={() => handleChoiceClick(index)}
                  isSelected={selected === index}
                  isCorrect={index === questions[currentQuestion].correctIndex}
                >
                  {/* Handle question type to render images or text */}
                  {questions[currentQuestion].questionType === "album_cover" ? (
                    <img src={choice} alt={`Choice ${index}`} /> // Display image for album cover questions
                  ) : (
                    <span>{choice}</span> // Display text for other question types
                  )}
                </ChoiceButton>
              ))}
            </div>
            <ScoreBoard>Score: {score}</ScoreBoard>

            {selected !== null && (
              <>
                <ResultMessage
                    style={{
                      marginTop: '20px',
                      fontSize: '1.5rem',
                      color: isCorrect ? 'green' : 'red',
                    }}
                    >{isCorrect ? "Correct!" : "Wrong!"}</ResultMessage>
                <button 
                    style={{
                      border: "2px solid black",
                      marginTop: "20px",
                      padding: "10px 20px",
                      backgroundColor: "white",
                      color: "black",
                      cursor: "pointer",
                  }}
                onClick={handleNextQuestion}>Next Question</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Questionnaire;
