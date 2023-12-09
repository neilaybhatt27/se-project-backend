const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRequestSchema = new Schema({
    requestingUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    otherUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    bookId : {type: Schema.Types.ObjectId, ref:"Book"}
});

module.exports = mongoose.model("ChatRequest", ChatRequestSchema);
   