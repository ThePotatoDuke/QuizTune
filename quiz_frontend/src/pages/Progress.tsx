import React, { useEffect, useState } from "react";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import styled from "styled-components";
import Container from "../comps/Container";
import { getUserQuizzes } from "../api/userApi";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user) {
        setError("User not found.");
        return; // Early return if user is null
      }

      try {
        const data = await getUserQuizzes(user.name); // Use dynamic userName
        setQuizzes(data!); // Assuming 'data' is an array of quizzes
      } catch (err: any) {
        setError(err.message || "Failed to fetch quizzes");
      }
    };

    fetchQuizzes();
  }, [user]); // Dependency array with 'user'

  const handleQuizClick = (quizId: number) => {
    navigate(`/quiz/${quizId}/questions`); // Navigate to the quiz's questions page
  };

  return (
    <Container>
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
      </Layout>
    </Container>
  );
};

export default Progress;
