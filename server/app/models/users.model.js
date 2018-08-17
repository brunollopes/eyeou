const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({

    email: String,
    // password: String,
    // access_id: String,
    // access_secret: String,
    // console_link: String,
    acess_code: Number,
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }],
    constests: [{
        type: Schema.Types.ObjectId,
        ref: 'Contest'
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);