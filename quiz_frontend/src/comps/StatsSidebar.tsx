import React from "react";
import styled from "styled-components";

const StatsSidebarContainer = styled.nav`
  background-color: rgb(36, 36, 36);
  color: white;
  width: 250px;
  min-height: calc(100vh - 90px); /* Adjust for header height */
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  margin: 5px;
`;

const StatsContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #333;
  border-radius: 10px;
`;

const StatsTitle = styled.h3`
  margin-bottom: 10px;
`;

const StatItem = styled.p`
  font-size: 1rem;
  margin: 5px 0;
`;

interface StatsSidebarProps {
  stats: {
    question_type: string;
    total_questions: number;
    correct_answers: number;
  }[];
}
const formatString = (str: string) => {
  return str
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};
const StatsSidebar: React.FC<StatsSidebarProps> = ({ stats }) => {
  return (
    <StatsSidebarContainer>
      <StatsTitle>Stats</StatsTitle>
      <StatsContainer>
        {" "}
        {/* Use StatsContainer here to wrap stats content */}
        {stats.length > 0 ? (
          stats.map((stat, index) => (
            <StatItem key={index}>
              {formatString(stat.question_type)}: {stat.correct_answers}/
              {stat.total_questions}
            </StatItem>
          ))
        ) : (
          <p>No stats available.</p>
        )}
      </StatsContainer>
    </StatsSidebarContainer>
  );
};

export default StatsSidebar;
