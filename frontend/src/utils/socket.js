import { io } from "socket.io-client";

let socket;

if (!socket) {
  console.log("🔌 Creating single socket instance...");
  socket = io(import.meta.env.VITE_API_URL, {
    transports: ["websocket"],
    autoConnect: true,
  });
} // Make sure backend is running
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});
export default socket;
