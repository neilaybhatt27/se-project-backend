const mongoose = require("mongoose");
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
        data: Buffer,
        contentType: String
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
    }
});
module.exports = mongoose.model("User", UserSchema);
