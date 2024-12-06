/*
Author: Oğuz (White) Akay
*/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";

const App: React.FC = () => {



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </Router>
  );
};

export default App;
