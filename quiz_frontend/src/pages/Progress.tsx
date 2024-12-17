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

interface HistoryItem {
	id: number;
	user_id: number | null;
	category_id: number;
	choices: string[];
	correct_index: number;
	user_answer_index: number;
	text: string;
}

const Progress: React.FC = () => {

	const [history, setHistory] = useState<HistoryItem[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
			const fetchHistory = async () => {
			try {
				// Here is where the examples have to be changed with the actual data
				const response = await fetch("/api/history"); 
				const data = await response.json();
				setHistory(data);
			} catch (error) {
				console.error("Error fetching history:", error);
			}
			};
		
			fetchHistory();
		}, []);

	return (
		<Container>
		<Topheader />
			<Layout>
				<LeftSideBar></LeftSideBar>
					<HistoryContainer>
						<h1>History of Answered Questions</h1>
						{history.length > 0 ? (
							history.map((item) => (
							<HistoryCard key={item.id}>
								<p>
								<strong>Question:</strong> {item.text}
								</p>
								<p>
								<strong>Your Answer:</strong>{" "}
								{item.choices[item.user_answer_index]}{" "}
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
				<p>No history available.</p>
			)}
			<button onClick={() => navigate("/home")}>Back to Home</button>
			</HistoryContainer>
			</Layout>
		</Container>
	);
};

export default Progress;

