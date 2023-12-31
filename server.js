const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const Server = require("socket.io").Server;
const socket = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Message = require('./models/communitymessage');
const Community = require('./models/community');
const Chat = require("./models/chats");
const communityRoutes = require('./routes/communityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const addbooksRoutes = require('./routes/addbooksRoute');
// const chatControler = require("./controllers/chatControler");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json({ limit: '50mb' }));
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
app.use('/dashboard', dashboardRoutes);
app.use('/community', communityRoutes);
app.use('/book',addbooksRoutes)

const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
    console.log("Server started on port", port);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});

global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   console.log("socket connected");
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     console.log("Received message in backend:", data.message, "from chat ID:", data.chatId);
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//     }
//   });

//   socket.on('message', async (data) => {
//     const community = await Community.findById(req.params.id);
//     const user = await User.findById(data.userId);
//     if (!community.members.includes(req.user._id)) {
//       return res.status(403).json({ message: "You are not authorized to send messages in this community." });
//     }
//     const newMessage = new Message({
//       content: data.text,
//       createdBy: user.username,
//       community: data.community,
//       time: new Date()
//     });
//     const message = await newMessage.save();
//     socket.broadcast.emit('message', message);
//   });
 
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Handle chat messages Working but not storing the messages in database
  // socket.on('send-msg', (data) => {
  //   console.log('Received message from', socket.id, ':', data.message);

  //   // Broadcast the message to all connected clients
  //   io.emit('send-msg', {
  //     chatId: data.chatId,
  //     message: data.message,
  //     senderId: data.senderId,
  //   }); 
  // });

  socket.on('send-msg', async (data) => {
    try {
      // Destructure data for clarity
      const { chatId, message, user } = data;

      // Log the received message
      console.log('Received message from', socket.id, ':', message);

      // Find the chat document by ID
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.error('Chat not found!');
        return; // Or handle this scenario as needed
      }

      // Push the new message to the chat's messages array
      chat.messages.push({
        user, // or socket.id if you want the socket's unique ID
        message,
        timestamp: Date.now()
      });

      // Save the updated chat document
      await chat.save();

      // Emit the message to all clients in the chat room
      // io.to(chatId).emit('chat-message', {
      //   user: senderId,
      //   message,
      //   timestamp: Date.now()
      // });
      io.emit('send-msg', {
            chatId: data.chatId,
            message: data.message,
            user: data.user,
          }); 

    } catch (err) {
      console.error('Error handling send-msg:', err);
      // Handle errors appropriately in your real app
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