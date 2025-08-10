import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaCircle, FaUserTie } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useSocket } from "../../context/SocketContext";

const MentorList = () => {
  const socket = useSocket();

  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { courseName = [], selectedTopic = [] } = location.state || {};

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/mentors`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setMentors(res.data.mentors);
      } catch (err) {
        console.error("Error fetching mentors", err);
        Swal.fire("Error", "Failed to load mentor list", "error");
      }
    };

    fetchMentors();

    socket.on("request-accepted", ({ roomId }) => {
      console.log(`Redirecting to Room : ${roomId}`);
      navigate(`/chat/${roomId}`);
    });
  }, []);

  const handleChatNow = (selectedMentorId, req) => {
    const studentId = sessionStorage.getItem("userId");

    if (!studentId) {
      console.error("❌ studentId is undefined");
      Swal.fire("Error", "Student is not logged in!", "error");
      return;
    }

    console.log("✅ Sending request with:", {
      mentorId: selectedMentorId,
      studentId,
      courseName,
      topicId: selectedTopic.id,
    });

    socket.emit("send-request", {
      mentorId: selectedMentorId,
      studentId,
      courseName,
      topicId: selectedTopic.id,
    });

    Swal.fire({
      title: "Request Sent!",
      text: "Your doubt request has been sent to the mentor.",
      icon: "success",
      confirmButtonText: "OK",
    })
  };

  return (
    <div className="container mt-5">
      <h4>Course Name : {courseName}</h4>
      <h5>Topic Name : {selectedTopic.name}</h5>
      <h6 className="text-center mb-4">👨‍🏫 Mentor List</h6>
      <div className="row">
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <div className="col-md-4" key={mentor._id}>
              <div className="card mb-4 shadow-sm rounded-4 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <FaUserTie size={24} className="me-2 text-primary" />
                    <h5 className="mb-0">{mentor.name}</h5>
                  </div>
                  <p className="mb-1">
                    <strong>Email:</strong> {mentor.email}
                  </p>
                  <p className="mb-3">
                    <strong>Status:</strong>{" "}
                    {mentor.status === "online" && (
                      <span className="text-success fw-bold">
                        <FaCircle size={10} className="me-1" /> Online
                      </span>
                    )}
                    {mentor.status === "busy" && (
                      <span className="text-warning fw-bold">
                        <FaCircle size={10} className="me-1" /> Busy
                      </span>
                    )}
                    {mentor.status === "offline" && (
                      <span className="text-danger fw-bold">
                        <FaCircle size={10} className="me-1" /> Offline
                      </span>
                    )}
                  </p>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleChatNow(mentor._id)}
                    >
                      Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted">No mentors found.</div>
        )}
      </div>
    </div>
  );
};

export default MentorList;
