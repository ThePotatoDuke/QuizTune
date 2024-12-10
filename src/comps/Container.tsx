
import styled from "styled-components";
import background from "../pages/background.jpg";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-image: url(${background});
    background-size: cover;
    background-position: center;
    font-family: Arial, sans-serif;

    @media (max-width: 768px) {
        background-size: contain;
    }
`;

export default Container;