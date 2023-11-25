const User = require("../models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get User's profile
exports.getProfile = async (req, res) => {
    const token = req.header("auth-token");
    if(!token) {
        return res.status(500).send("Access Denied!");
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified._id);
        res.json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Update user location
exports.updateLocation = async (req, res) => {
    const token = req.header("auth-token");
    if(!token) {
        return res.status(500).send("Access Denied!");
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified._id);
        user.location.type = req.body.location.type;
        user.location.coordinates = req.body.location.coordinates;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

//Update profile picture
exports.updateProfilePicture = async (req, res) => {
    const token = req.header("auth-token");
    if(!token) {
        return res.status(500).send("Access Denied!");
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified._id);
        user.profilePicture.data = req.file.buffer;
        user.profilePicture.contentType = req.file.mimetype;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};