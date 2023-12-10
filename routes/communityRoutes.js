const express = require('express');
const router = express.Router();
const communitiesController = require('../controllers/communityController');
const verifyToken = require('../middleware/verifyToken');
const Message = require('../models/communitymessage');
const User = require('../models/users')

// Route to create a new community
router.post('/new',verifyToken.authenticate, communitiesController.createCommunity);

// Route to get all communities
router.get('/all', verifyToken.authenticate, communitiesController.getAllCommunities);

// Route to get a community by its ID
router.get('/:id', verifyToken.authenticate, communitiesController.getCommunityById);

// Route to join a community
router.post('/:id/join', verifyToken.authenticate, communitiesController.joinCommunity);

// Route to leave a community
router.post('/:id/leave', verifyToken.authenticate, communitiesController.leaveCommunity);

// Route to post a message in a community

router.post('/:id/messages', verifyToken.authenticate, async (req, res) => {
    const user = await User.findById(data.userId);
    const io = req.app.get('io');
    const { content } = req.body;
    const newMessage = new Message({
    content,
    createdBy: user.username,
    community: req.params.id,
    userId: req.user._id,
    time: new Date()
    });
   
    try {
    const message = await newMessage.save();
    io.emit('message', message); 
    res.status(201).json(message);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
   });
   

// router.post('/:id/messages',authenticateToken, communitiesController.postMessage);

// Route to get all messages in a community
router.get('/:id/messages', verifyToken.authenticate, communitiesController.getCommunityMessages);

module.exports = router;
