
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import RightSidebar from "../comps/rightSidebar";
import Container from "../comps/Container";

const MainContent = styled.main`
    flex-grow: 1;
    padding: 20px;
`;

const Layout = styled.div`
    display: flex;
`;

const Card = styled.div`
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin: 10px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
    &:hover {
        background: grey;
      }
`;

const DashboardTitle = styled.h2`
    color: #333;
    margin-bottom: 20px;
`;

const Home: React.FC = () => {

    const navigate = useNavigate();
    
    // Direction to the expected pages
    const navToChallenge = () => {navigate("/quiz")}


  return (
    <Container>
      <Topheader></Topheader>
      <Layout>
        <LeftSideBar>
        </LeftSideBar>
        <MainContent>
          <DashboardTitle>Challenges</DashboardTitle>
          <Card onClick={navToChallenge}>
            <h3>Challenge #1</h3>
            <p>Do it!</p>
          </Card>
          <Card onClick={navToChallenge}>
            <h3>Challenge #2</h3>
            <p>Do it!</p>
          </Card>
          <Card onClick={navToChallenge}>
            <h3>Challenge #3</h3>
            <p>Do it!</p>
          </Card>
        </MainContent>
      <RightSidebar></RightSidebar>
      </Layout>
      </Container>
  );
};

export default Home;
