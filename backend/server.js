const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
const http = require("http");
const { Server } = require("socket.io");

const topicList = require('./data/topicData.json');

const dbConnect = require("./config/db");
const User = require("./models/User");

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
/*
const  connecteusers = {
  "userId-1234": {
    role: "mentor/student",
    sockets: []
  } 
}
*/
const connectedUsers = {}; // socket.id -> mentorId
const rooms = {}; // socket.id -> studentId
const pendingRequests = {}; // mentorId -> [{ studentId, studentName }]
const getUserSocket = (userId) => {
  return connectedUsers[userId]?.sockets || []
}

io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);
  socket.on("connect-user", ({ user_id, role }) => {

    if (!connectedUsers[user_id]) {
      connectedUsers[user_id] = {
        id: user_id,
        role,
        sockets: []
      };
    }

    connectedUsers[user_id].sockets.push(socket.id)

    console.log("🟢 User online:", connectedUsers);

    if (role === 'mentor') {
      const requestsArray = Object.values(rooms)
        .filter(req => req.mentorId === user_id && req.status === 'pending')
        .map(async (req) => {
          const studentName = await User.findById(req.studentId).select("name").name

          const topic = Object.values(topicList).find(ele => ele.id === req.topicId);

          return {
            StudentName: studentName, studentId: req.studentId, roomId: req.roomId, requestedAt: req.requestedAt, TopicName: topic.name
          }
        })
        const mentorSocket = connectedUsers[user_id].sockets;
    
        for (let socket of mentorSocket) {
          io.to(socket).emit("previous-requets", requestsArray)
        }
    }

    
  });

  socket.on("remove-user", ({ userId }) => {
    // Find the user by socket ID and remove
    delete connectedUsers[userId]
    console.log("🧹 User Disconnected : ", userId);
  });

  socket.on("send-request", async ({ mentorId, studentId, courseName, topicId }) => {
    const roomId = uuidv4()
    const requestDetails = {
      roomId,
      studentId,
      mentorId,
      courseName,
      topicId,
      status: "pending",
      requestedAt: new Date().toISOString()
    }

    console.log("Request Details : ", requestDetails);

    const mentorSocket = getUserSocket(mentorId)
    // const studentSocket = getUserSocket(studentId);

    const topic = topicList[courseName].find(ele => ele.id === topicId)

    const studentName = await User.findById(studentId).select("name")

    if (mentorSocket.length > 0) {
      for (let userSocket of mentorSocket) {
        io.to(userSocket).emit("incoming-request", { StudentName: studentName.name, studentId, roomId, requestedAt: requestDetails.requestedAt, TopicName: topic.name });
      }
    }

    rooms[roomId] = requestDetails;
  })
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
