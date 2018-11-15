const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContestSchema = mongoose.Schema({
    prize_money: Schema.Types.Mixed,
    start_date: Date,
    contest_name: String,
    openphase_duration: Number,
    contest_title: String,
    submit_time: Date,
    review_time: Date,
    bgprofile_image: [{
        type: String
    }],
    entry_price: Number,
    results: String,
    review_startdate: Date,
    reviewphase_duration: Number,
    close_date: Date,
    type: String,
    slug: {
        type: String,
        required: true,
        unique: true
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    published: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Contest', ContestSchema);