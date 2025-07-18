import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaCircle, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { io, Socket } from "socket.io-client";
import Swal from "sweetalert2";
import socket from '../../utils/socket';

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();

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
  }, []);

  const handleViewProfile = (mentorId) => {
    navigate(`/mentor-profile/${mentorId}`);
  };

  const handleChatNow = (selectedMentorId) => {
    const studentId = sessionStorage.getItem('userId')
    socket.emit("send-request", {mentorId: selectedMentorId, studentId})
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👨‍🏫 Mentor List</h2>
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
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewProfile(mentor._id)}
                    >
                      View Profile
                    </button>
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
