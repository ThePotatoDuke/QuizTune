import React from "react";
import { useLocation } from "react-router-dom";
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

	// To pass the selected types
	const location = useLocation();
	const { questionType } = location.state || {};

	// In case of an Emergency!
	if (!questionType) {
		return <div>Error: No question type selected!</div>;
	}

	return (
		<Container>
		<Topheader></Topheader>
		<Layout>
			<LeftSideBar></LeftSideBar>
			<MainContent>
			<Questionnaire selectedType={questionType} ></Questionnaire>
			{/*This is where the real deal is*/}
			</MainContent>
		</Layout>
		</Container>
	);
};

export default Quiz;