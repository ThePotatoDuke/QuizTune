
import React from "react";
import styled from "styled-components";

const Sidebar = styled.nav`
    background-color: #333;
    color: white;
    width: 250px;
    min-height: calc(100vh - 90px); /* Adjust for header height */
    padding: 20px;
    box-sizing: border-box;
    border-radius: 10px; 
    margin: 5px;
`;

export default Sidebar;