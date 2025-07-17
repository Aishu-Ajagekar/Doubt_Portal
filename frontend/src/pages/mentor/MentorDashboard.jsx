

import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket"; // ✅ shared instance

const MentorDashboard = () => {
  
  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">👨‍🏫 Mentor Dashboard</h2>
      <p className="text-center text-muted mt-3">
        You are <strong>online</strong>. Waiting for student requests...
      </p>
    </div>
  );
};

export default MentorDashboard;
