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
    background-color: rgb(71, 71, 71);
	color: rgb(255, 255, 255);
    border-radius: 8px;
    padding: 20px;
    margin: 10px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
    transition: all 0.5s ease;
    &:hover {
      background: rgb(50, 121, 77);
    }
`;

const DashboardTitle = styled.h2`
    color:rgb(255, 255, 255);
    margin-bottom: 20px;
`;

const Home: React.FC = () => {
const navigate = useNavigate();

// With the question type being selectable an all
const navToQuiz = (type: string) => {
    navigate("/quiz", { state: { questionType: type } });
};

	return (
		<Container gradient="linear-gradient(0deg,rgb(0, 0, 0),rgb(5, 143, 0))">
		<Topheader></Topheader>
		<Layout>
			<LeftSideBar></LeftSideBar>
			<MainContent>
			<DashboardTitle>Challenges</DashboardTitle>
			<Card onClick={() => navToQuiz("release_date")}>
				<h3>Challenge: Release Date</h3>
				<p>Answer questions about song release dates.</p>
			</Card>
			<Card onClick={() => navToQuiz("artist")}>
				<h3>Challenge: Artist</h3>
				<p>Answer questions about song artists.</p>
			</Card>
			<Card onClick={() => navToQuiz("popularity")}>
				<h3>Challenge: Popularity</h3>
				<p>Answer questions about song popularity.</p>
			</Card>
			<Card onClick={() => navToQuiz("album_cover")}>
				<h3>Challenge: Album Cover</h3>
				<p>Answer questions about album covers.</p>
			</Card>
			<Card onClick={() => navToQuiz("random")}>
				<h3>Challenge: Random</h3>
				<p>Answer a mix of random questions.</p>
			</Card>
			</MainContent>
			<RightSidebar></RightSidebar>
		</Layout>
		</Container>
	);
};

export default Home;
