const User = require("../models/users");
const fs = require('fs');

// Get User's profile
exports.getProfile = async (req, res) => {
    try {
        const verified = req.user;
        const user = await User.findById(verified._id);
        const base64Image = Buffer.from(user.profilePicture.data).toString('base64');
        res.json({user: user, image: base64Image});
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
        user.profilePicture.data = fs.readFileSync(path.join(uploadPath + '/defaults/' + req.file.filename));
        user.profilePicture.contentType = req.file.mimetype;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};