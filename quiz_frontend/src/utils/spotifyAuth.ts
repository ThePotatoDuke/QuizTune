// Generate a random code verifier for PKCE
export function generateCodeVerifier(length: number): string {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

// Generate a code challenge from the code verifier using SHA-256
export async function generateCodeChallenge(
  codeVerifier: string
): Promise<string> {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await window.crypto.subtle.digest("SHA-256", data);

	return btoa(
		String.fromCharCode.apply(null, Array.from(new Uint8Array(digest)))
	)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

// Redirect user to Spotify authorization endpoint
export async function redirectToAuthCodeFlow(clientId: string) {
	const verifier = generateCodeVerifier(128);
	const challenge = await generateCodeChallenge(verifier);

	localStorage.setItem("verifier", verifier);

	const params = new URLSearchParams();
	params.append("client_id", clientId);
	params.append("response_type", "code");
	params.append("redirect_uri", "http://localhost:3000/"); // use the correct URI

	params.append("scope", "user-read-private user-read-email user-library-read");
	params.append("code_challenge_method", "S256");
	params.append("code_challenge", challenge);

	document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange authorization code for access token
export async function getAccessToken(
  clientId: string,
  code: string
): Promise<string> {
	const verifier = localStorage.getItem("verifier");

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
		"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
		client_id: clientId,
		grant_type: "authorization_code",
		code,
		redirect_uri: "http://localhost:3000/", // Must match the redirect URI
		code_verifier: verifier!,
		}),
  });

	if (!response.ok) {
		throw new Error("Failed to get access token");
	}

	const data = await response.json();
	return data.access_token;
}

// Fetch user profile data from Spotify
export async function fetchProfile(accessToken: string): Promise<any> {
	const response = await fetch("https://api.spotify.com/v1/me", {
		headers: {
		Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch profile");
	}

	return response.json();
}

// Optional: Fetch a random favorite track or implement custom logic
export async function randomTrackQuestion(accessToken: string) {
	console.log("Fetching random track...");
	// Implement your logic here
}
