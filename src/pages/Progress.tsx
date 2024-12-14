import React from "react";
import styled from "styled-components";
import { useUser } from "../context/UserContext";

const ProgressBarContainer = styled.div`
  width: 80%;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px auto;
  height: 25px;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  background-color: #4caf50;
  height: 100%;
  transition: width 0.3s ease;
`;

const ScoreBoard = styled.div`
  margin: 20px auto;
  font-size: 1.5rem;
  color: black;
  text-align: center;
`;

const Progress: React.FC = () => {
  const { user } = useUser();

  if (!user) return <div>Please log in to view progress.</div>;

  // Ensure all category values are valid progress numbers (0 - 100)
  const categories = Object.entries(user.progress);

  // Calculate total progress across all categories
  const totalProgress = categories.reduce((acc, [_, progress]) => acc + progress, 0);

  // Maximum possible total progress (each category can go from 0 to 100)
  const maxPossibleProgress = categories.length * 100;

  // Calculate the overall progress percentage
  const overallProgress = (totalProgress / maxPossibleProgress) * 100;

  return (
    <div>
      <h2>Progress Tracker</h2>

      {/* Display the user's total score */}
      <ScoreBoard>
        Your Total Score: {user.points} / {categories.length * 10}
      </ScoreBoard>

      {/* Display progress for each category */}
      {categories.map(([category, progress]) => (
        <div key={category}>
          <h3>{category.toUpperCase()}</h3>
          <ProgressBarContainer>
            <ProgressBarFill progress={progress} />
          </ProgressBarContainer>
          <div style={{ textAlign: "center" }}>
            {progress}% Completed
          </div>
        </div>
      ))}

      {/* Display the overall progress */}
      <h3>Overall Progress</h3>
      <ProgressBarContainer>
        <ProgressBarFill progress={overallProgress} />
      </ProgressBarContainer>
      <div style={{ textAlign: "center" }}>
        {overallProgress.toFixed(2)}% Completed
      </div>
    </div>
  );
};

export default Progress;
