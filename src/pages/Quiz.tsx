import React from "react";
import styled from "styled-components";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import Questionnaire from "../comps/questionnaire";
import Container from "../comps/Container";

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
`;

const Layout = styled.div`
  display: flex;
`;

const Quiz: React.FC = () => {
  return (
    <Container>
      <Topheader></Topheader>
      <Layout>
        <LeftSideBar></LeftSideBar>
        <MainContent>
          <Questionnaire></Questionnaire>
          {/*This is where the real deal is*/}
        </MainContent>
      </Layout>
    </Container>
  );
};

export default Quiz;
