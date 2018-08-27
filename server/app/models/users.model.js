const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  email: String,
  googleID: String,
  password: String,
  verified: Boolean,
  notify: {
    type: Boolean,
    default: false
  },
  full_name: String,
  acess_code: Number,
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }],
  contests: [{
    type: Schema.Types.ObjectId,
    ref: 'Contest'
  }]

}, {
    timestamps: true
  });

UserSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

UserSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);