
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const SidebarLinks = styled.ul`
    list-style: none;
    padding: 0;

    li {
      margin: 10px 0;
      padding: 10px;
      cursor: pointer;
      transition: background 0.3s;
    }
`;

const NormalButton = styled.li`
    background-color: #333; 
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
    text-align: left;
    &:hover {
      background-color: #575757; 
    }
`;

const LogoutButton = styled.li`
    background-color: #e74c3c; /* Red background for logout */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #c0392b; /* Darker red on hover */
    }
`;

const LeftSideBar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {

    const navigate = useNavigate();

    const navToChallenge = () => {navigate("/quiz")}
    const navToHome = () => {navigate("/home")}
    const navToProgress = () => {navigate("/progress")}

    const handleLogout = () => {
        // Clear user authentication data which we might need
        localStorage.removeItem("authToken"); 
      
        // Redirection to login
        window.location.href = "/"; 
    };

    return (
		<Sidebar>
		<SidebarLinks>
			<NormalButton onClick={navToHome}>Home</NormalButton>
			<NormalButton onClick={navToProgress}>Progress</NormalButton>
			<li>Settings</li>
			<LogoutButton onClick={handleLogout}>Logout</LogoutButton>
		</SidebarLinks>
		</Sidebar>
    );
};
  
  export default LeftSideBar;