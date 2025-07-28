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
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(null);
  const chatEndRef = useRef(null);

  const senderName = sessionStorage.getItem("name");
  const senderRole = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  const [fileReady, setFileReady] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);

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
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        roomId,
        senderName,
      });
    }

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
    setIsFileLoading(true)
    const reader = new FileReader();

    reader.onload = () => {
      setFile({
        name: selectedFile.name,
        type: selectedFile.type,
        data: reader.result, // this is the base64 string
      });

      setFileReady(true);
      setIsFileLoading(false)
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
        <input type="file" onChange={handleFileChange} />
        {isFileLoading && (
  <span className="ms-2 text-primary small">Loading file...</span>
)}
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
