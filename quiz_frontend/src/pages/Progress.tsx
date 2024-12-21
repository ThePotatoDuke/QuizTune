import React, { useEffect, useState } from "react";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import styled from "styled-components";
import Container from "../comps/Container";
import { getUserQuizzes } from "../api/userApi";
import { useUser } from "../context/UserContext";

const Layout = styled.div`
  display: flex;
`;

// Define the quiz type
interface Quiz {
  id: number;
  name: string;
  user_id: number;
  // Add any other properties based on your schema
}

const Progress: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // Use the Quiz type
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user) {
        setError("User not found.");
        return; // Early return if user is null
      }
      try {
        const data = await getUserQuizzes(user.name); // Replace with dynamic userName
        setQuizzes(data!);
      } catch (err: any) {
        setError(err.message || "Failed to fetch quizzes");
      }
    };

    fetchQuizzes();
  }, []); // You can modify the dependencies if you need to fetch again based on userName or other factors

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
                {quizzes.map((quiz) => (
                  <li key={quiz.id}>{quiz.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Layout>
    </Container>
  );
};

export default Progress;
