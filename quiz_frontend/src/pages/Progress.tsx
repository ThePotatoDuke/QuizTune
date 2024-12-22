import React, { useEffect, useState } from "react";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import Container from "../comps/Container";
import { getUserQuizzes, getUserStats } from "../api/userApi";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Sidebar from "../comps/Sidebar";

const Layout = styled.div`
  display: flex;
`;
interface Quiz {
  id: number;
  name: string;
  // Add other fields as necessary
}
const Progress: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Get user from context
  const navigate = useNavigate(); // Hook to navigate to quiz question page
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
        return; // Early return if user is null
      }

      try {
        // Fetch quizzes
        const quizzesData = await getUserQuizzes(user.name);
        setQuizzes(quizzesData);

        // Fetch stats
        const statsData = await getUserStats(user.name);
        setStats(statsData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [user]); // Dependency array with 'user'

  const handleQuizClick = (quizId: number) => {
    navigate(`/quiz/${quizId}/questions`); // Navigate to the quiz's questions page
  };

  return (
    <Container gradient="linear-gradient(0deg, rgb(0, 0, 0), rgb(5, 143, 255))">
      <Topheader />
      <Layout>
        <LeftSideBar />
        <div>
          {error ? (
            <div>Error: {error}</div>
          ) : (
            <>
              <h2>Your Quizzes</h2>
              <ul>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <li key={quiz.id}>
                      <button onClick={() => handleQuizClick(quiz.id)}>
                        {quiz.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <p>No quizzes found.</p>
                )}
              </ul>
            </>
          )}
        </div>
        <Sidebar></Sidebar>
      </Layout>
    </Container>
  );
};

export default Progress;
