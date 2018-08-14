const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    email: String,
    // password: String,
    // access_id: String,
    // access_secret: String,
    // console_link: String,
    acess_code: Number

}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);