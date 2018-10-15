const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: Date,
  locationAddress: String,
  phoneNumber: String,
  gender: String,
  aboutMe: String,
  email: String,
  googleID: String,
  facebookID: String,
  password: String,
  resetCode: String,
  verified: Boolean,
  profilePictureURL: {
    type: String,
    default: 'https://s3.amazonaws.com/eyeou-public/anonymous-avatar-sm.jpg'
  },
  notify: {
    type: Boolean,
    default: false
  },
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