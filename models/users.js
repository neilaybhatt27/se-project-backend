const mongoose = require("mongoose");
const fs = require('fs');

const defaultImageData = fs.readFileSync("./defaults/default-img.jpg");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    userRating: {
        type: Number,
        default: 0
    },

    profilePicture: {
        data: {
            type: Buffer,
            default: defaultImageData
        },
        contentType: {
            type: String,
            default: "default-image.jpg"
        }
    },

    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [Number]
    },

    subscription: {
        type: Boolean,
        default: false
    },

    chats: [{
        chatId: {
            type: Schema.Types.ObjectId,
            ref: 'Chat'
        },
        otherUser: String
    }] 
});
module.exports = mongoose.model("User", UserSchema);
