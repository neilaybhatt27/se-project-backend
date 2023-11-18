const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//User registration
exports.register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profilePicture: req.body.picture,
            location: req.body.location,
            subscription: req.body.subscription || false
        });

        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};