
import React from "react";
import Topheader from "../comps/Topheader";
import LeftSideBar from "../comps/leftSidebar";
import styled from "styled-components";
import Container from "../comps/Container";

const Layout = styled.div`
    display: flex;
`;

const Progress: React.FC = () => {
    return (
        <Container>        
            <Topheader>
            </Topheader>
            <Layout>
                <LeftSideBar>
                </LeftSideBar>
            </Layout>
        </Container>
    );
};

export default Progress;