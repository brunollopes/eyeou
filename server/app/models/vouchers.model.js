const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PromoCodes = mongoose.Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    code: String,
    limit: Number,
    used: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PromoCodes', PromoCodes);