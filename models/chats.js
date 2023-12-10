const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },

    messages: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]

});

module.exports = mongoose.model("Chat", chatSchema);