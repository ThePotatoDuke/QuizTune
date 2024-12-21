import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  fetchFavoriteTracks,
  generateAnswerOptions,
  generateTrackQuestion,
} from "../utils/spotifyUtils";
import { useUser } from "../context/UserContext";
import { addQuestion, updateUserScore } from "../api/userApi";

const ChoiceButton = styled.button<{
  isCorrect?: boolean;
  isSelected?: boolean;
}>`
  background-color: ${({ isSelected, isCorrect }) =>
    isSelected
      ? isCorrect
        ? "rgb(4, 219, 68)"
        : "rgb(219, 0, 0)"
      : "rgb(71, 71, 71)"};
  border: 1px solid rgb(129, 129, 129);
  color: white;
  padding: 20px;
  font-size: 1.8rem;
  cursor: ${({ isSelected }) => (isSelected ? "not-allowed" : "pointer")};
  border-radius: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease;
  margin: 20px;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? "" : "#ddd")};
    color: black;
  }

  img {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const ResultMessage = styled.div`
  margin-top: 20px;
  font-size: 1.7rem;
  color: rgb(255, 255, 255);
`;

const QuestionText = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 4rem;
  color: rgb(221, 248, 255);
`;

const ScoreBoard = styled.div`
  margin-top: 20px;
  font-size: 3rem;
  color: rgb(166, 201, 186);
`;

const MenuButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: rgb(0, 123, 255);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgb(0, 123, 255);
  }
`;

interface Question {
  text: string;
  choices: string[];
  correctIndex: number;
  userAnswerIndex?: number | null;
  track?: any;
  category: string;
}

interface QuestionnaireProps {
  selectedType: string;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ selectedType }) => {
  const { user, setUser } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const maxQuestions = 2;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user?.accessToken) {
        console.error("No access token found!");
        return;
      }

      try {
        let tracks = await fetchFavoriteTracks(user.accessToken);

        if (tracks.length === 0) {
          console.log("No favorite tracks found.");
          return;
        }
        tracks = [...tracks].sort(() => Math.random() - 0.5);

        const generatedQuestions: Question[] = await Promise.all(
          tracks.slice(0, maxQuestions).map(async (track) => {
            const category =
              selectedType === "random"
                ? ["release_date", "artist", "popularity", "album_cover"][
                    Math.floor(Math.random() * 4)
                  ]
                : selectedType;

            const { question, correctAnswer } = generateTrackQuestion(
              track,
              category
            );

            const answerOptions = generateAnswerOptions(
              correctAnswer,
              category,
              tracks
            );

            const textOptions = answerOptions.map((option) => String(option));

            return {
              text: question,
              choices: textOptions,
              correctIndex: textOptions.indexOf(String(correctAnswer)),
              track,
              category,
            };
          })
        );

        setQuestions(generatedQuestions.slice(0, maxQuestions));
      } catch (error) {
        console.error("Error fetching tracks or generating questions:", error);
      }
    };

    fetchQuestions();
  }, [user?.accessToken, selectedType]);

  const navToHome = () => {
    navigate("/home");
  };

  const handleChoiceClick = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === questions[currentQuestion].correctIndex;
    setIsCorrect(correct);
    questions[currentQuestion].userAnswerIndex = index;
    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    setSelected(null);
    setIsCorrect(null);
    setCurrentQuestion((prev) => prev + 1);
  };

  const isQuizOver = currentQuestion >= questions.length;

  const handleQuizEnd = async () => {
    if (user) {
      try {
        // Update user score
        const updatedUser = await updateUserScore(
          user.name,
          Number(user.points) + score
        );
        setUser({ ...user, points: updatedUser.score });

        // Prepare questions array
        const questionsPayload = questions.map((question) => ({
          text: question.text,
          choices: question.choices,
          correctIndex: question.correctIndex,
          category: question.category,
          userAnswerIndex: question.userAnswerIndex || null,
        }));

        // Send questions in a single API call
        await addQuestion(questionsPayload, user.name);
      } catch (error) {
        console.error("Failed to update score or add questions:", error);
      }
    }
  };

  return (
    <div>
      {isQuizOver ? (
        <div>
          <QuestionText>Quiz Completed!</QuestionText>
          <ScoreBoard>
            Your Score: {score} / {questions.length * 10}
          </ScoreBoard>
          <MenuButton
            onClick={async () => {
              await handleQuizEnd();
              navToHome();
            }}
          >
            Return to Menu
          </MenuButton>
        </div>
      ) : (
        <>
          <div>
            <QuestionText>{questions[currentQuestion].text}</QuestionText>

            <div>
              {questions[currentQuestion].choices.map((choice, index) => (
                <ChoiceButton
                  key={index}
                  onClick={() => handleChoiceClick(index)}
                  isSelected={selected === index}
                  isCorrect={index === questions[currentQuestion].correctIndex}
                >
                  {questions[currentQuestion].category === "album_cover" ? (
                    <img src={choice} alt={`Choice ${index}`} />
                  ) : (
                    <span>{choice}</span>
                  )}
                </ChoiceButton>
              ))}
            </div>
            <ScoreBoard>Score: {score}</ScoreBoard>

            {selected !== null && (
              <>
                <ResultMessage
                  style={{
                    marginTop: "20px",
                    fontSize: "2rem",
                    color: isCorrect ? "green" : "red",
                  }}
                >
                  {isCorrect ? "Correct!" : "Wrong!"}
                </ResultMessage>
                <button
                  style={{
                    border: "2px solid black",
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "white",
                    color: "black",
                    cursor: "pointer",
                  }}
                  onClick={handleNextQuestion}
                >
                  Next Question
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Questionnaire;
