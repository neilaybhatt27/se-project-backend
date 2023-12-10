const express = require('express');
const router = express.Router();
const token = require('../middleware/verifyToken');
const chatController = require("../controllers/chatControler");

router.post("/sendRequest", token.authenticate, chatController.sendChatRequest);
router.post("/acceptRequest", token.authenticate, chatController.acceptChatRequest);
router.get("/allChatRequests", token.authenticate, chatController.getAllChatRequests);
// router.post("/new", token.authenticate, chatController.createChat);
router.post("/sendMessage", token.authenticate, chatController.sendMessage);
router.get("/messages/:chatId", token.authenticate, chatController.getChatsByID);
router.get("/", token.authenticate, chatController.getChats);
router.delete("/declineRequest", token.authenticate, chatController.declineChatRequest);

module.exports = router;