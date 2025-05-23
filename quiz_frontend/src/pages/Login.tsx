import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import the useUser hook
import {
	fetchProfile,
	getAccessToken,
	redirectToAuthCodeFlow,
} from "../utils/spotifyAuth";
import syncUserWithBackend from "../api/userApi";

// Assume `getAccessToken`, `fetchProfile`, and `redirectToAuthCodeFlow` are available utility functions

const Login: React.FC = () => {
	const navigate = useNavigate();
	const { setUser } = useUser(); // Access setUser function from context

	const clientId = "ddfd97f98dbd402788670fc5a2a118bf"; // Your Spotify client ID

	useEffect(() => {
		const handleLogin = async () => {
			const params = new URLSearchParams(window.location.search);
			const code = params.get("code");

			if (!code) {
				// If no code is present, redirect to Spotify for login
				redirectToAuthCodeFlow(clientId);
			} else {
				try {
					// Exchange the authorization code for an access token
					const accessToken = await getAccessToken(clientId, code);

					// Fetch the user's profile information using the access token
					const profile = await fetchProfile(accessToken);

					// Initial user object with default points
					const user = {
						name: profile.display_name,
						avatar: profile.images[0]?.url || "https://via.placeholder.com/40", // Default avatar if not available
						points: 0, // Default value; will be updated if user exists in DB
					};

					// Sync user with the backend and retrieve their points
					const updatedUser = await syncUserWithBackend(user);

					// Update user context with backend data
					setUser({ ...updatedUser, accessToken, avatar: user.avatar }); // Ensure avatar is included

					// Redirect to the home page after successful login
					navigate("/home");
				} catch (error) {
					console.error("Error during authentication process:", error);
				}
			}
		};

		handleLogin();
	}, [navigate, setUser, clientId]);

	return (
		<div style={{ textAlign: "center", marginTop: "20%" }}>
			<h1>Welcome to the App</h1>
			<p>Redirecting to Spotify for authentication...</p>
		</div>
	);
};

export default Login;
