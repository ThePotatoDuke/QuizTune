const syncUserWithBackend = async (user: {
  name: string;
  points: number;
  avatar: string;
}) => {
  try {
    const response = await fetch("http://localhost:5000/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: user.name, score: user.points }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync user");
    }

    const data = await response.json();

    if (data.user) {
      console.log("User synced successfully:", data);
      return { ...user, points: data.user.score }; // Ensure avatar is retained
    }

    return user; // Return the original user if no backend data is available
  } catch (error) {
    console.error("Error syncing user with backend:", error);
    throw error;
  }
};

const updateUserScore = async (name: string, newScore: number) => {
  try {
    const response = await fetch("http://localhost:5000/api/updateScore", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, points: newScore }), // Pass name and new score
    });

    if (!response.ok) {
      throw new Error("Failed to update score");
    }

    const data = await response.json();
    console.log("Score updated successfully:", data);

    return data.user; // Return the updated user object
  } catch (error) {
    console.error("Error updating score:", error);
    throw error;
  }
};

// Default export for syncUserWithBackend
export default syncUserWithBackend;

// Named export for updateUserScore
export { updateUserScore };
