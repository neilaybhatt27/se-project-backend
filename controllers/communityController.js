const Community = require('../models/community');
const Message = require('../models/communitymessage');
const User = require("../models/users")
// Create a new community
exports.createCommunity = async (req, res) => {
  const { name, description} = req.body;
  const newCommunity = new Community({
    name,
    description,
    createdby: req.user._id,
    members: [req.user._id]
  });

  try {
    const community = await newCommunity.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all communities
exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a community by its ID
exports.getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (community) {
      res.json(community);
    } else {
      res.status(404).json({ message: 'Community not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a community
exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    console.log(req.user)
    if (community) {
      community.members.push(req.user._id);
      await community.save();
      res.json(community);
    } else {
      res.status(404).json({ message: 'Community not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave a community
exports.leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (community) {
      community.members.pull(req.user._id);
      await community.save();
      res.json(community);
    } else {
      res.status(404).json({ message: 'Community not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Post a message in a community
exports.postMessage = async (req, res) => {
  const { content } = req.body;
  const community = await Community.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!community.members.includes(req.user._id)) {
    return res.status(403).json({ message: "You are not authorized to send messages in this community." });
  }

  const newMessage = new Message({
    content,
    createdBy: user.username,
    community: req.params.id
  });

  try {
    const message = await newMessage.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all messages in a community
exports.getCommunityMessages = async (req, res) => {
  try {
    const messages = await Message.find({ community: req.params.id });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
