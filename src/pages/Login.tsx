import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import the useUser hook
import {
  fetchProfile,
  getAccessToken,
  redirectToAuthCodeFlow,
} from "../utils/spotifyAuth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access setUser function from context

  const clientId = "ddfd97f98dbd402788670fc5a2a118bf";

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        redirectToAuthCodeFlow(clientId); // Redirect to Spotify for login
      } else {
        try {
          // Exchange authorization code for access token
          const accessToken = await getAccessToken(clientId, code);
          const profile = await fetchProfile(accessToken);

          setUser({
            // Set the user data in context
            name: profile.display_name,
            avatar: profile.images[0]?.url || "https://via.placeholder.com/40",
            points: 50, // Example default value, modify as needed
          });

          // Redirect to the home page after successful login
          navigate("/home");
        } catch (error) {
          console.error("Error during authentication process:", error);
        }
      }
    };

    handleLogin();
  }, [navigate, setUser]);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>Welcome to the App</h1>
      <p>Redirecting to Spotify for authentication...</p>
    </div>
  );
};

export default Login;
