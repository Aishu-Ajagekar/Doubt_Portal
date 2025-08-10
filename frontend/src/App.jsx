import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

import MentorDashboard from "./pages/mentor/MentorDashboard";
import Navbar from "./components/Navbar";
import ChatRoom from "./components/ChatRoom";
import MentorList from "./pages/mentor/MentorList";
import StudentDashboard from "./pages/student/StudentDashboard";
import Home from "./components/Home";

function App() {
  const [theme, setTheme] = useState(
    sessionStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  // const [topicId, setTopicId] = useState("");
  // const [mentorId, setMentorId] = useState("");
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Router> */}
      <Navbar theme={theme} setTheme={setTheme} />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* <Route path="/" element={<Register theme={theme} />} /> */}
          <Route path="/register" element={<Register theme={theme} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          {/* <Route
            path="/student/chat/:topicId"
            element={<StudentChat theme={theme} />}
          /> */}
          <Route path="/mentor" element={<MentorDashboard theme={theme} />} />
          <Route path="/mentor/mentor-list" element={<MentorList />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
          {/* <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentChat />
            </ProtectedRoute>
          }
        /> */}
        </Routes>
      </main>

      {/* </Router> */}
    </div>
  );
}

export default App;
