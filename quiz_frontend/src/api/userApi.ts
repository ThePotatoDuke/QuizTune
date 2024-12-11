const syncUserWithBackend = async (user: { name: string; points: number }) => {
	try {
		const response = await fetch("http://localhost:5000/api/addUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: user.name, score: user.points }), // Sending name and score
		});

		if (!response.ok) {
			throw new Error("Failed to sync user");
		}

		const data = await response.json();
		console.log("User synced successfully:", data);
		} catch (error) {
		console.error("Error syncing user with backend:", error);
	}
};
export default syncUserWithBackend;
