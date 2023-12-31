const User = require("../models/users");
const Chat = require("../models/chats");
const ChatRequest = require("../models/chatRequest");
const Book = require("../models/book");

// Send a chat request
exports.sendChatRequest = async (req, res) => {
    try {
      const verified = req.user;
      const chatRequest = new ChatRequest({
        requestingUserId: verified._id,
        otherUserId: req.body.otherUserId,
        bookId: req.body.bookId
      });
      const savedChatRequest = await chatRequest.save();
      res.json(savedChatRequest);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
};

//Get All chat requests
exports.getAllChatRequests = async (req, res) => {
    try {
        const verified = req.user;
        const chatRequests = await ChatRequest.find({otherUserId: verified._id}).populate('bookId');
        res.json(chatRequests);
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


        const otherUser = await User.findById(chatRequest.requestingUserId);
        const chat = new Chat({
            bookId: req.body.bookId,
            users: [chatRequest.requestingUserId, chatRequest.otherUserId]
        });

        const savedChat = await chat.save();

        const book = await Book.findById(chat.bookId);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        book.currentBorrower = chatRequest.requestingUserId;
        book.status = 'borrowed';
        await book.save();

        user.chats.push({chatId: savedChat._id, otherUser: otherUser.username});
        await user.save();
        otherUser.chats.push({chatId: savedChat._id, otherUser: user.username});
        await otherUser.save();

        // ChatRequest.deleteOne({_id: chatRequest._id}).then(function (req, res) {
        //     res.json(savedChat);
        // }).catch(function (err) {
        //     res.status(500).json({message: err.message});
        // });
        await ChatRequest.deleteOne({_id: chatRequest._id});

        res.json(savedChat);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.declineChatRequest = async (req, res) => {
    try {
        const verified = req.user;
        const chatRequest = await ChatRequest.findById(req.body.chatRequestId);
        if (chatRequest.status !== 'pending') return res.status(400).send('Invalid chat request status');
        await ChatRequest.deleteOne({_id: chatRequest._id});
        res.json({message: "Chat Declined!"});
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
        console.log(user);
        res.json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getChatsByID = async (req, res) => {
    try {
        const verified = req.user;
        // const otherUser = await User.findOne({email: req.params.email});
        // console.log(otherUser);
        const chats = await Chat.findById(req.params.chatId).populate('messages');
        let otherUserId = chats.users[0];
        if(chats.users[0] == verified._id) {
            otherUserId = chats.users[1]; 
        }
        const otherUser = await User.findById(otherUserId);
        const base64Image = Buffer.from(otherUser.profilePicture.data).toString('base64');
        res.json({chats: chats.messages, image: base64Image});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};