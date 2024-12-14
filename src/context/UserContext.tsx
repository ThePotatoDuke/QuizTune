import React, { createContext, useContext, useState } from "react";

// Define the user data structure including progress
interface User {
  name: string;
  avatar: string;
  points: number;
  accessToken: string | null; // Add accessToken to the User interface
  progress: Record<string, number>; // New field for progress tracking, where keys are category names and values are progress percentage
}

// Create the context with a default value of null
const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateCategoryProgress: (category: string, increment: number) => void; // Add function to update progress
}>({
  user: null,
  setUser: () => {},
  updateCategoryProgress: () => {},
});

// Create a custom hook to access the context
export const useUser = () => useContext(UserContext);

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize the user state with progress
  const [user, setUser] = useState<User | null>({
    name: "Guest",
    avatar: "https://via.placeholder.com/150",
    points: 0,
    accessToken: null,
    progress: {
      release_date: 0,
      artist: 0,
      popularity: 0,
      album_cover: 0,
      random: 0, // Track progress for each category
    },
  });

  // Function to update category progress
  const updateCategoryProgress = (category: string, increment: number) => {
    if (!user) return; // Check if user is available
    const updatedProgress = { ...user.progress };
    updatedProgress[category] = Math.min(updatedProgress[category] + increment, 100); // Increment and cap progress at 100
    setUser({ ...user, progress: updatedProgress });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateCategoryProgress }}>
      {children}
    </UserContext.Provider>
  );
};
