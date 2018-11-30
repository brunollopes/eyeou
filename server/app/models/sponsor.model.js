const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SponsorsModel = mongoose.Schema(
  {
    contests: [{ type: Schema.Types.ObjectId, ref: 'Contest' }],
    name: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Sponsor', SponsorsModel);