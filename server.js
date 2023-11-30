const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const Server = require("socket.io").Server;
const socket = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Chat = require("./models/chats");
// const chatControler = require("./controllers/chatControler");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl)
  .then(function () {
    console.log("database connected!");
  })
  .catch(function (err) {
    console.log(err);
  });

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);

const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
    console.log("Server started on port", port);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  console.log("socket connected");
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:8080",
//     credentials: true
//   }
// });

// global.onlineUsers = new Map();

// const getKey = (map, val) => {
//   for (let [key, value] of map.entries()) {
//     if (value === val) return key;
//   }
// };

// io.on("connection", (socket) => {
//   console.log("Socket connected");
//   global.chatSocket = socket;

//   socket.on("addUser", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     socket.emit("getUsers", Array.from(onlineUsers));
//   });

//   socket.on("sendMessage", ({ senderId, receiverId, message }) => {
//     const sendUserSocket = onlineUsers.get(receiverId);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("getMessage", {
//         senderId,
//         message,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     onlineUsers.delete(getKey(onlineUsers, socket.id));
//     socket.emit("getUsers", Array.from(onlineUsers));
//   });
// });

// io.on('connection', (socket) => {
//   console.log('New client connected');
//   socket.on('disconnect', () => {
//    console.log('Client disconnected');
//   });
 
//   socket.on('join-chat', async (chatId) => {
//    const chat = await Chat.findById(chatId).populate('messages');
//    socket.join(chatId);
//    console.log(chat);
//    socket.emit('chat-messages', chat.messages);
 
//    socket.on('send-chat-message', async (message) => {
//      const chat = await Chat.findById(chatId);
//      chat.messages.push({ user: socket.id, message, timestamp: Date.now() });
//      await chat.save();
//      io.to(chatId).emit('chat-message', { user: socket.id, message, timestamp: Date.now() });
//    });
//   });
//  });