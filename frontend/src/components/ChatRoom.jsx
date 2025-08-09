import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import { useSocket } from "../context/SocketContext"; // your socket instance
import { useHistoryStack } from "../context/HistoryContext";

const ChatRoom = () => {
  const navigate = useNavigate();
  const { historyStack } = useHistoryStack();
  const socket = useSocket();
  const { roomId } = useParams();
  // const data = useParams();
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  // const [topicName, setTopicName] = useState("");
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const chatEndRef = useRef(null);

  const senderName = sessionStorage.getItem("name");
  const senderRole = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  const [fileReady, setFileReady] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const userRole = sessionStorage.getItem("role"); // "student" or "mentor"

  // Scroll to bottom on new message
  useEffect(() => {
    // if (chatEndRef.current) {
    //   chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    // }
    // socket.emit("join-room", { roomId });
    if (socket && roomId) {
      socket.emit("join-room", { roomId, userName: senderName });

      // 🔥 Emit message-read when user opens the chat room
      socket.emit("message-read", { roomId, readerName: senderName });
    }
  }, [roomId]);

  useEffect(() => {
    const handleFocus = () => {
      socket.emit("message-read", { roomId, readerName: senderName });
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    // socket.emit("join-room", );

    // const fetchMessages = async () => {
    //   try {
    //     console.log("Topic Id while fething messages", topicId);
    //     const res = await axios.get(
    //       `${import.meta.env.VITE_API_URL}/api/v1/messages`,
    //       {
    //         params: {
    //           topicId,
    //         },
    //         headers: {
    //           Authorization: token,
    //         },
    //       }
    //     );
    //     setChat(res.data.messages);
    //     setTopicName(res.data.topicName);
    //   } catch (err) {
    //     console.error("❌ Error fetching messages:", err);
    //   }
    // };
    // fetchMessages();

    socket.on("receive-message", (message) => {
      console.log(message);
      setChat((prev) => [...prev, message]);
    });

    // socket.on("typing", ({ senderName }) => {
    //   console.log("👀 Mentor received typing from:", senderName);
    //   setIsTyping(senderName);
    //   setTimeout(() => setIsTyping(null), 2000);
    // });
    socket.on("show-typing", ({ senderName: typingSender }) => {
      if (typingSender !== senderName) {
        setTypingUser(typingSender);
      }
    });

    socket.on("hide-typing", () => {
      setTypingUser(null);
    });

    return () => {
      // socket.emit("leave-room", topicId);
      socket.off("receive-message");
      socket.off("typing");
    };
  }, []);

  const handleTyping = () => {
    // if (!isTyping) {
    //   setIsTyping(true);
    //   socket.emit("typing", {
    //     roomId,
    //     senderName,
    //   });
    // }
    socket.emit("typing", {
      roomId,
      senderName,
    });

    // Clear previous timeout
    if (window.typingTimeout) clearTimeout(window.typingTimeout);

    // Set new timeout for stop-typing
    window.typingTimeout = setTimeout(() => {
      socket.emit("stop-typing", { roomId });
      setIsTyping(false);
    }, 1000); // 1 second
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
    handleTyping();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setIsFileLoading(true);
    const reader = new FileReader();

    reader.onload = () => {
      setFile({
        name: selectedFile.name,
        type: selectedFile.type,
        data: reader.result, // this is the base64 string
      });

      setFileReady(true);
      setIsFileLoading(false);
    };

    reader.readAsDataURL(selectedFile); // start reading
  };

  const sendMessage = () => {
    if (!msg.trim() && (!file || !fileReady)) return;

    const newMsg = {
      content: msg,
      time: new Date().toISOString(),
      senderName,
      senderRole,
      roomId,
      attachment: fileReady ? file : null,
    };

    // Add to UI immediately
    // setChat((prev) => [...prev, newMsg]);

    // Send to server
    console.log("File State : ", fileReady);
    socket.emit("send-message", newMsg);

    setMsg("");
    setFile(null);
    setFileReady(false);
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", roomId);

    const redirectPath = {
      student: "/student-dashboard",
      mentor: "/mentor",
      default: "/dashboard",
    };

    const stepsBack = [...historyStack]
      .reverse()
      .findIndex((path) => path === redirectPath[userRole]);

    if (stepsBack !== -1) {
      // Go back N steps until dashboard
      navigate(-stepsBack);
    } else {
      // If not found, fallback
      navigate("/dashboard", { replace: true });
    }

    // if (userRole === "student") {
    //   navigate("/student-dashboard", { replace: true });
    // } else if (userRole === "mentor") {
    //   navigate("/mentor", { replace: true });
    // } else {
    //   navigate("/dashboard", { replace: true }); // fallback
    // }
  };

  const confirmLeave = () => {
    setShowConfirmModal(false);
    handleLeaveRoom();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0">🔗 Chat Room - {roomId}</h4>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => setShowConfirmModal(true)}
        >
          🚪 Leave Chat
        </button>
      </div>

      <div
        className="border rounded p-3 mb-3"
        style={{ height: "500px", overflowY: "auto" }}
      >
        {chat.map((m, i) => {
          const isMe =
            m.senderRole === senderRole && m.senderName === senderName;
          return (
            <div
              key={i}
              className={`mb-2 d-flex ${
                isMe ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded shadow-sm ${
                  isMe ? "bg-primary text-white" : "bg-light text-dark"
                }`}
                style={{ maxWidth: "75%" }}
              >
                <div className="small fw-bold mb-1">
                  {m.senderName} ({m.senderRole})
                </div>
                <div>{m.content}</div>
                {m.attachment && (
                  <div>
                    {m.attachment.type.startsWith("image/") ? (
                      <img
                        src={m.attachment.data}
                        alt={m.attachment.name}
                        style={{ maxWidth: "200px", display: "block" }}
                      />
                    ) : (
                      <a
                        href={m.attachment.data}
                        download={m.attachment.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-secondary mt-1"
                      >
                        {m.attachment.name}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUser && (
          <div className="text-muted small fst-italic ps-2">
            {typingUser} is typing
            <span className="typing-dots ms-1">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="d-flex">
        <input
          className="form-control me-2"
          placeholder="Type a message..."
          value={msg}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <input type="file" onChange={handleFileChange} />
        {isFileLoading && (
          <span className="ms-2 text-primary small">Loading file...</span>
        )}
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>

      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Leave Chat Room</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to leave this chat?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmLeave}>
                  Yes, Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
