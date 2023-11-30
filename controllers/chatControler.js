const User = require("../models/users");
const Chat = require("../models/chats");
const ChatRequest = require("../models/chatRequest");

// Send a chat request
exports.sendChatRequest = async (req, res) => {
    try {
      const verified = req.user;
      const chatRequest = new ChatRequest({
        requestingUserId: verified._id,
        otherUserId: req.body.otherUserId
      });
      const savedChatRequest = await chatRequest.save();
      res.json(savedChatRequest);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
};   

// Accept a chat request
exports.acceptChatRequest = async (req, res) => {
    try {
        const verified = req.user;
        const user = await User.findById(verified._id);
        const chatRequest = await ChatRequest.findById(req.body.chatRequestId);
        if (chatRequest.status !== 'pending') return res.status(400).send('Invalid chat request status');
        chatRequest.status = 'accepted';
        const savedChatRequest = await chatRequest.save();

        const otherUser = await User.findById(req.body.otherUserId);
        const chat = new Chat({
            topic: req.body.topic,
            users: [chatRequest.requestingUserId, chatRequest.otherUserId]
        });

        const savedChat = await chat.save();
        user.chats.push(savedChat._id);
        await user.save();
        otherUser.chats.push(savedChat._id);
        await otherUser.save();

        res.json(savedChat);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};   

//Create a chat
// exports.createChat = async (req, res) => {
//     try {
//         const verified = req.user;
//         const user = await User.findById(verified._id);
//         const otherUser = await User.findById(req.body.otherUserId);
//         const chat = new Chat({ users: [user._id, otherUser._id] });
//         const savedChat = await chat.save();
//         user.chats.push(savedChat._id);
//         await user.save();
//         otherUser.chats.push(savedChat._id);
//         await otherUser.save();
//         res.json(savedChat);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// };

exports.sendMessage = async (req, res) => {
    try {
        const verified = req.user;
        const chat = await Chat.findById(req.body.chatId);
        const message = { user: verified._id, message: req.body.message, timestamp: Date.now() };
        chat.messages.push(message);
        const savedChat = await chat.save();
        res.json(savedChat);
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getChats = async (req, res) => {
    try {
        const verified = req.user;
        const user = await User.findById(verified._id).populate('chats');
        res.json(user.chats);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getChatsByID = async (req, res) => {
    try {
        const verified = req.user;
        const otherUser = await User.findOne({email: req.body.email});
        const chats = await Chat.findById(otherUser._id).populate('messages');
        res.json(chats);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};