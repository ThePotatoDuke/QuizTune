/* It's working omg!!!!!!!!!!!! */
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

const ChoiceButton = styled.button<{ isCorrect?: boolean; isSelected?: boolean }>`
    background-color: ${({ isSelected, isCorrect }) =>
        isSelected ? (isCorrect ? "#4caf50" : "#e74c3c") : "#f9f9f9"};
    border: 2px solid #ccc;
    color: #000;
    padding: 40px;
    font-size: 1.2rem;
    cursor: ${({ isSelected }) => (isSelected ? "not-allowed" : "pointer")};
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ isSelected }) => (isSelected ? "" : "#ddd")};
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

// This DOES NOT WORK (the way I wanted it to) idk why?
const handleNextQuestionButton = styled.button`
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    cursor: "pointer",
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

const Questionnaire: React.FC = () => {
  // Quiz data which will come from dataset from our beloved friend Berkay 
    const questions = [
    {
        text: "What is the capital of France?",
        image: "https://via.placeholder.com/400",
        choices: ["Berlin", "Madrid", "Paris", "Rome"],
        correctIndex: 2,
    },
    {
        text: "What is 2 + 2?",
        image: "https://via.placeholder.com/400",
        choices: ["3", "4", "5", "6"],
        correctIndex: 1,
    },
    {
        text: "Which planet is known as the Red Planet?",
        image: "https://via.placeholder.com/400",
        choices: ["Earth", "Mars", "Venus", "Jupiter"],
        correctIndex: 1,
    },
    
    ];

    const navigate = useNavigate();

    const navToHome = () => {navigate("/home")}

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
        <Container>
        {isQuizOver ? (
            <QuestionContainer>
            <h1>Quiz Completed!</h1>
            <ScoreBoard>Your Score: {score} / {questions.length * 10}</ScoreBoard>
            <MenuButton onClick={navToHome}>Return to Menu</MenuButton>
            </QuestionContainer>
        ) : (
            <>
            {/* Image */}
            <ImageContainer>
                <img
                src={questions[currentQuestion].image}
                alt="Question"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
            </ImageContainer>

            {/* Question and Choices */}
            <QuestionContainer>
                <QuestionText>{questions[currentQuestion].text}</QuestionText>
                <ChoicesContainer>
                {questions[currentQuestion].choices.map((choice, index) => (
                    <ChoiceButton
                    key={index}
                    onClick={() => handleChoiceClick(index)}
                    isCorrect={index === questions[currentQuestion].correctIndex}
                    isSelected={selected !== null}
                    >
                    {choice}
                    </ChoiceButton>
                ))}
                </ChoicesContainer>
                {selected !== null && (
                <>
                    <ResultMessage>
                    {isCorrect ? "Correct! " : "Wrong! "}
                    </ResultMessage>
                    
                    <button
                    style={{
                        border: "2px solid #ccc",
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "teal",
                        color: "white",
                        cursor: "pointer",
                    }} onClick={handleNextQuestion}> Next Question </button>
                    {/*Why can't I do the same thing whit using the components. why why why where is this inconsistency?*/}
                </>
                )}
                <ScoreBoard>Score: {score}</ScoreBoard>
            </QuestionContainer>
            </>
        )}
        </Container>
    );
};

export default Questionnaire;
