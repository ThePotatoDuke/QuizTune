
import React from "react";
import styled from "styled-components";
import token from "../pages/token.png"

const Header = styled.header`

    background-color: black;
    padding: 20px;
    color: white;
    text-align: left;
    font-size: 1.5rem;
    align-items: center;
    display: flex;
    justify-content: space-between /* Pushes the Profile to the right side*/
`;

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`;

const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 20px;
`;

const UserName = styled.span`
    font-size: 1rem;
`;

const PointsSection = styled.div`
    display: flex;
    align-items: center;
    margin-right: 25px;
`;

const TokenImage = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 5px;
`;

const PointsText = styled.span`
    font-size: 1rem;
    color: white;
`;

const Topheader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    /* This is where our user's infomation resides */
    const user = {
        name: "gooner4ever",
        avatar: "https://via.placeholder.com/40",
        points: 50,
    };

    return (
        <Header>
            <div>Spofued</div>
            <ProfileSection>
                <PointsSection>
                    <TokenImage src={token} alt="Token" />
                    <PointsText>{user.points}</PointsText>
                </PointsSection>
                <ProfileImage src={user.avatar} alt="User Profile" />
                <UserName>{user.name}</UserName>
            </ProfileSection>
            {children}
        </Header>
    );
};
  
  export default Topheader;