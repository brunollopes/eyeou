const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = mongoose.Schema({
  text: String,
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Comment', CommentSchema);