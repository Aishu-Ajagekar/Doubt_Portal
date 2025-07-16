const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const dbConnect = require("./config/db");

dotenv.config();
dbConnect();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:517*",
    methods: ["GET", "POST"],
  },
});

server.on("listening", () => {
  console.log(`🔧 HTTP server ready on port ${PORT}`);
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/topics", require("./routes/topicRoutes"));

app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ========== SOCKET.IO ==========
const connectedUsers = {}; // socket.id -> mentorId
const rooms = {}; // socket.id -> studentId
const pendingRequests = {}; // mentorId -> [{ studentId, studentName }]


/*
{
    "roomId-123": {
        roomId: "roomId-123"
        studentId: "1",
        topicId: "mern123",
        mentorId: ""
    }
}
*/
io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);
  socket.on("connect-user", ({ user_id, role }) => {
    connectedUsers[user_id] = {
      socketId: socket.id,
      role,
    };
    console.log("🟢 User online:", connectedUsers);
  });

  socket.on("remove-user", ({userId}) => {
    // Find the user by socket ID and remove
    delete connectedUsers[userId]
    console.log("🧹 User Disconnected : ", userId);
    console.log("User list : ", connectedUsers)
  });


});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
