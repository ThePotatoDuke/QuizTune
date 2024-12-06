/*This page is not needed anymore*/
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  fetchProfile,
  getAccessToken,
  redirectToAuthCodeFlow,
} from "../utils/spotifyAuth";

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const clientId = "ddfd97f98dbd402788670fc5a2a118bf";

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        // No authorization code, redirect to Spotify for login
        redirectToAuthCodeFlow(clientId);
      } else {
        try {
          // Authorization code present, exchange for access token
          const accessToken = await getAccessToken(clientId, code);
          const profile = await fetchProfile(accessToken);

          console.log(profile); // Logs profile data to the console

          // Display a random favorite track (implement your logic in randomTrackQuestion)
          //await randomTrackQuestion(accessToken);

          // Navigate to the home page after successful authentication
          navigate("/home"); // Navigates to the /home route
        } catch (error) {
          console.error("Error during authentication process:", error);
        }
      }
    };

    handleLogin();
  }, [navigate]); // Add navigate to the dependency array

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>Welcome to the App</h1>
      <p>Redirecting to Spotify for authentication...</p>
    </div>
  );
};

export default Login;
