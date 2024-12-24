import React, { useEffect, useState } from "react";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import Container from "../comps/Container";
import { getUserQuizzes, getUserStats } from "../api/userApi";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import StatsSidebar from "../comps/StatsSidebar"; // Correct case

interface Quiz {
    id: number;
    name: string;
    // Add other fields as necessary
}

const Layout = styled.div`
    display: flex;
    justify-content: space-between;
`;

const MainContent = styled.div`
    flex-grow: 1;
    padding: 20px;
`;

const QuizGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

const QuizCard = styled.div`
    background:rgb(85, 85, 85);
    color: rgb(255, 255, 255);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: "Roboto", sans-serif;
    font-size: 30px;

    height: 90px;

    display: flex;
    justify-content: center;
    align-items: center; // Ensures quiz name is centered vertically and horizontally

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
    }

    button {
        width: 100%;
        height: 100%;
        font-size: 16px;
        font-weight: bold;
        color: #333;
        background: transparent;
        border: none;
        cursor: pointer;
    }
`;

const HistoryTitle = styled.h1`
    margin-bottom: 20px;
    color: rgb(224, 244, 255);
    font-size: 2rem;
`;

const ErrorText = styled.div`
    color: red;
    font-weight: bold;
    margin-top: 20px;
`;

const Progress: React.FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const navigate = useNavigate();
    const [stats, setStats] = useState<
        {
            question_type: string;
            total_questions: number;
            correct_answers: number;
        }[]
    >([]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                setError("User not found.");
                return;
            }

            try {
                const quizzesData = await getUserQuizzes(user.name);
                setQuizzes(quizzesData);

                const statsData = await getUserStats(user.name);
                setStats(statsData);
            } catch (err: any) {
                setError(err.message || "Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, [user]);

    const handleQuizClick = (quizId: number) => {
        navigate(`/quiz/${quizId}/questions`);
    };

    return (
        <Container gradient="linear-gradient(0deg, rgb(0, 0, 0), rgb(5, 143, 255))">
            <Topheader />
            <Layout>
                <LeftSideBar />
                <MainContent>
                    {error ? (
                        <ErrorText>{error}</ErrorText>
                    ) : (
                        <>
                            <HistoryTitle>Your Quizzes</HistoryTitle>
                            {quizzes.length > 0 ? (
                                <QuizGrid>
                                    {quizzes.map((quiz) => (
                                        <QuizCard
                                            key={quiz.id}
                                            onClick={() => handleQuizClick(quiz.id)}
                                        >
                                            {quiz.name}
                                        </QuizCard>
                                    ))}
                                </QuizGrid>
                            ) : (
                                <p>No quizzes found.</p>
                            )}
                        </>
                    )}
                </MainContent>
                <StatsSidebar stats={stats} />
            </Layout>
        </Container>
    );
};

export default Progress;
