const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.String,
    ref: 'User',
    required: true
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community'
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
