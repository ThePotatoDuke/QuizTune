import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import Container from "../comps/Container";

const Layout = styled.div`
  	display: flex;
`;

const HistoryContainer = styled.div`
  padding: 20px;
`;

const HistoryCard = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

const CorrectAnswer = styled.span`
  color: green;
  font-weight: bold;
`;

const WrongAnswer = styled.span`
  color: red;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

interface AnsweredQuestion {
  id: number;
  text: string;
  choices: string[];
  correct_index: number;
  user_answer_index: number;
}

const Progress: React.FC = () => {
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const navigate = useNavigate();

  // Fetch answered questions from backend
  useEffect(() => {
    const fetchAnsweredQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/answeredQuestions");
        if (!response.ok) {
          throw new Error("Failed to fetch answered questions");
        }
        const data = await response.json();
        setAnsweredQuestions(data);
      } catch (error) {
        console.error("Error fetching answered questions:", error);
      }
    };

    fetchAnsweredQuestions();
  }, []);

	return (
		<Container>
		<Topheader />
			<Layout>
				<LeftSideBar></LeftSideBar>
				<HistoryContainer>
					<h1>Answered Questions History</h1>
					{answeredQuestions.length > 0 ? (
						answeredQuestions.map((item) => (
						<HistoryCard key={item.id}>
							<p>
							<strong>Question:</strong> {item.text}
							</p>
							<p>
							<strong>Your Answer:</strong> {item.choices[item.user_answer_index]}{" "}
							{item.user_answer_index === item.correct_index ? (
								<CorrectAnswer>(Correct)</CorrectAnswer>
							) : (
								<WrongAnswer>(Wrong)</WrongAnswer>
							)}
							</p>
							<p>
							<strong>Correct Answer:</strong>{" "}
							<CorrectAnswer>{item.choices[item.correct_index]}</CorrectAnswer>
							</p>
						</HistoryCard>
						))
					) : (
						<p>No answered questions found.</p>
					)}
					<Button onClick={() => navigate("/home")}>Back to Home</Button>
				</HistoryContainer>
			</Layout>
		</Container>
	);
};

export default Progress;

