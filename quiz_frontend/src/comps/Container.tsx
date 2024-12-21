
import React from "react";
import styled from "styled-components";
import background from "../pages/background.jpg";

interface GradientContainerProps {
    gradient: string; // Gradient string passed as a prop
    children: React.ReactNode;
}

const StyledContainer = styled.div<{ gradient: string }>`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    background: ${({ gradient }) => gradient};
    transition: background 5s ease-in-out;

    @media (max-width: 768px) {
        background-size: contain;
    }
`;

const Container: React.FC<GradientContainerProps> = ({
	gradient,
	children,
	}) => {
	return <StyledContainer gradient={gradient}>{children}</StyledContainer>;
};

export default Container;