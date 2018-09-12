const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SurveySchema = mongoose.Schema({
  users: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  answers: {
    type: Array
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Survey', SurveySchema);