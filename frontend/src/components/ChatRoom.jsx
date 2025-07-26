import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";
import { useSocket } from "../context/SocketContext"; // your socket instance

const ChatRoom = () => {
  const socket = useSocket();
  const { roomId } = useParams();
  const data = useParams();
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [topicName, setTopicName] = useState("");
  const [isTyping, setIsTyping] = useState(null);
  const chatEndRef = useRef(null);

  const senderName = sessionStorage.getItem("name");
  const senderRole = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  // Scroll to bottom on new message
  useEffect(() => {
    // if (chatEndRef.current) {
    //   chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    // }
    socket.emit("join-room", { roomId });
  }, [roomId]);

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

    return () => {
      // socket.emit("leave-room", topicId);
      socket.off("receive-message");
      socket.off("typing");
    };
  }, []);

  const handleTyping = () => {
    // socket.emit("typing", {
    //   room: topicId,
    //   senderName,
    // });
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
    handleTyping();
  };

  const sendMessage = () => {
    if (!msg.trim()) return;
  
    const newMsg = {
      content: msg,
      time: new Date().toISOString(),
      senderName,
      senderRole,
      roomId
    };
  
    // Add to UI immediately
    // setChat((prev) => [...prev, newMsg]);
  
    // Send to server
    socket.emit("send-message", newMsg);
  
    setMsg("");
  };
  

  return (
    <div className="container mt-4">
      <h4 className="mb-3">🔗 Chat Room - {roomId}</h4>

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
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="text-muted small fst-italic ps-2">
            {isTyping} is typing
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
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
