import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import Container from "../comps/Container";

const Layout = styled.div`
  	display: flex;
`;

const HistoryContainer = styled.div`
    flex-grow: 1;
    padding: 20px;

	height: 86vh; /* Sets a fixed height relative to the viewport */
	overflow-y: auto; /* Makes the container scrollable */

`;

const HistoryCard = styled.div`
	border: 1px solid #ddd;
	padding: 20px;
	margin-bottom: 15px;
	border-radius: 10px;
	background-color:rgb(34, 34, 34);
	color: rgb(255, 255, 255);
	border: 1px solid rgb(102, 102, 102);
`;

const OptionsContainer = styled.div`
	display: flex;
	flex-wrap: wrap; 
	gap: 20px; /* Add spacing between options */
`;

const Option = styled.div<{ isCorrect: boolean; isSelected: boolean }>`
	background-color: ${({ isCorrect, isSelected }) =>
		isCorrect
		? "rgb(26, 197, 49)" // Green for correct
		: isSelected
		? "rgb(224, 16, 16)" // Red for wrong
		: "rgb(80, 80, 80)"};
	flex: 1 1 200px; /* Makes each option grow and have a base width of 200px */
	text-align: center;
	padding: 10px;
	border-radius: 20px;
	color: ${({ isCorrect, isSelected }) =>
		isCorrect || isSelected ? "white" : "white"};
	font-weight: ${({ isCorrect, isSelected }) =>
		isCorrect || isSelected ? "bold" : "normal"};
	border: 1px solid rgb(160, 160, 160);
	margin: 8px;

	img {
        width: 250px;
        height: 250px;
        object-fit: cover;
        border-radius: 20px;
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
							<OptionsContainer>
							{item.choices.map((choice, index) => (
									<Option
									key={index}
									isCorrect={index === item.correct_index}
									isSelected={index === item.user_answer_index}
								>
									{choice.startsWith("http") ? ( // Too lazy to fetch questionType
									<img
										src={choice} alt={`Option ${index}`}
									/>
									) : (
									<span>{choice}</span> // Shows the choices as text instead of images if it is not a link
									)}
								</Option>
							))}
							</OptionsContainer>
						</HistoryCard>
						))
					) : (
						<p>No answered questions found.</p>
					)}
				</HistoryContainer>
			</Layout>
		</Container>
	);
};

export default Progress;

