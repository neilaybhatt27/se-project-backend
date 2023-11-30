const User = require("../models/users");

// Get User's profile
exports.getProfile = async (req, res) => {
    try {
        const verified = req.user;
        const user = await User.findById(verified._id);
        res.json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Update user location
exports.updateLocation = async (req, res) => {
    try {
        const verified = req.user;
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
    try {
        const verified = req.user;
        const user = await User.findById(verified._id);
        user.profilePicture.data = req.file.buffer;
        user.profilePicture.contentType = req.file.mimetype;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};