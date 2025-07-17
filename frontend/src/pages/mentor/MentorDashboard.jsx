

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../../context/SocketContext' // ✅ shared instance
import { CheckCircle, XCircle, Clock } from "lucide-react";

const MentorDashboard = () => {
  const socket = useSocket();
  const [requests, setRequests] = useState([])

  useEffect(() => {

    if (!socket) return;

    const handleIncomingRequest = (newRequest) => {
      setRequests((prevRequests) => [...prevRequests, newRequest]);
    };

    socket.on("incoming-request", handleIncomingRequest)

    return () => {
      socket.off("incoming-request", handleIncomingRequest);
    };

  }, [])

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">👨‍🏫 Mentor Dashboard</h2>
      <p className="text-center text-muted mt-3">
        You are <strong>online</strong>. Waiting for student requests...
      </p>
      <strong>Incoming Request</strong>

      {requests.map(req => (
        <div
          key={`${req.roomId}-${req.studentId}`}
          className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-200 border border-gray-100"
        >
          {/* Left Side - Info (stacked vertically) */}
          <div className="flex flex-col space-y-1">
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
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition" style={{backgroundColor: "green", marginRight: "10px"}}
              onClick={() => {}}
            >
              <CheckCircle className="w-4 h-4" /> Accept
            </button>

            <button
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
              style={{backgroundColor: "red"}}
              onClick={() => { }}
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
