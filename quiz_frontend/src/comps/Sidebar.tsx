import React from "react";
import styled from "styled-components";

const SidebarContainer = styled.nav`
  background-color: rgb(36, 36, 36);
  color: white;
  width: 300px;
  min-height: calc(100vh - 90px); /* Adjust for header height */
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  margin: 5px;
`;

interface SidebarProps {
	children: React.ReactNode; // Accepts any content inside the Sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
	return <SidebarContainer>{children}</SidebarContainer>;
};

export default Sidebar;
