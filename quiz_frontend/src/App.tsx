/*
Author: Oğuz (White) Akay
*/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import { UserProvider } from "./context/UserContext";
import QuizQuestions from "./pages/QuizQuestions";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/quiz/:quizId/questions" element={<QuizQuestions />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
