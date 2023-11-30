const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

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

//User login
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).json({message: "User Not Found!"});
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.status(400).json({message: "Invalid password!"});
        }

        //Generate token
        const token = jwt.sign({_id: user._id}, secretKey, {expiresIn: "12h"});
        res.header("Auth-Token", token).json({token, _id: user._id, email: user.email, username: user.username});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}