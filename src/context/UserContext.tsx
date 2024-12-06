import React, { createContext, useContext, useState } from "react";

// Define the user data structure
interface User {
  name: string;
  avatar: string;
  points: number;
}

// Create the context with a default value of null
const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  user: null,
  setUser: () => {},
});

// Create a custom hook to access the context
export const useUser = () => useContext(UserContext);

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
