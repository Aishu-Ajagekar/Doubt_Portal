import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext"; // ✅ shared instance
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Swal from "sweetalert2";

const MentorDashboard = () => {
  const socket = useSocket();
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const acceptRequest = (roomId, studentId, studentName, topic) => {
    socket.emit("accept-request", {
      roomId,
      studentId,
      studentName,
      topic,
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingRequest = (newRequest) => {
      setRequests((prevRequests) => [...prevRequests, newRequest]);
    };

    socket.on("previous-requets", (prevRequests) => {
      setRequests(prevRequests);
    });
    socket.on("incoming-request", handleIncomingRequest);

    socket.on("request-accepted", ({ roomId }) => {
      console.log(`Redirecting to Room : ${roomId}`);
      navigate(`/chat/${roomId}`);
    });

    return () => {
      socket.off("incoming-request", handleIncomingRequest);
    };
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">👨‍🏫 Mentor Dashboard</h2>
      <p className="text-center text-muted mt-3">
        You are <strong>online</strong>. Waiting for student requests...
      </p>
      <strong>Incoming Request</strong>

      {requests.map((req) => (
        <div
          key={`${req.roomId}-${req.studentId}`}
          className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-200 border border-gray-100"
        >
          {/* Left Side - Info (stacked vertically) */}
          <div className="flex flex-col space-y-1 mb-2">
            <div className="text-lg font-semibold text-gray-800">
              📌 Topic Name: <span className="font-bold">{req.TopicName}</span>
            </div>
            <div className="text-sm text-gray-600">
              👤 Student: {req.StudentName}
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-4 h-4 mr-1" /> {req.requestedAt}
            </div>
          </div>

          {/* Right Side - Buttons */}
          <div className="flex gap-3 ml-4">
            <button
              // className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
              // style={{ backgroundColor: "green", marginRight: "10px" }}
              className="btn btn-success py-2 px-3 btn-sm me-2 shadow"
              onClick={() =>
                Swal.fire({
                  title: "Accept Request?",
                  text: `Do you want to accept ${req.StudentName}'s request on "${req.TopicName}"?`,
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, Accept",
                }).then((result) => {
                  if (result.isConfirmed) {
                    acceptRequest(
                      req.roomId,
                      req.StudentId,
                      req.StudentName,
                      req.TopicName
                    );
                    navigate(`/chat/${req.roomId}`);
                  }
                })
              }
            >
              <CheckCircle className="w-4 h-4" /> Accept
            </button>

            <button
              // className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
              // style={{ backgroundColor: "red" }}
              className="btn btn-danger py-2 px-3 btn-sm shadow"
              onClick={() =>
                Swal.fire({
                  title: "Decline Request?",
                  text: `Are you sure you want to decline ${req.StudentName}'s request?`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#e74c3c",
                  cancelButtonColor: "#95a5a6",
                  confirmButtonText: "Yes, Decline",
                }).then((result) => {
                  if (result.isConfirmed) {
                    declineRequest(req.roomId); // implement this if needed
                    // Swal.fire(
                    //   "Declined!",
                    //   "The request has been declined.",
                    //   "error"
                    // );
                  }
                })
              }
            >
              <XCircle className="w-4 h-4" /> Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentorDashboard;
