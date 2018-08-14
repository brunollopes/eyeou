const mongoose = require('mongoose');

const ContestSchema = mongoose.Schema({
    prize_money: Number,
    start_date: Date,
    contest_name: String,
    openphase_duration: Number,
    contest_title: String,
    submit_time: Date,
    review_time: Date,
    bgprofile_image: String,
    entry_price: Number,
    results: String,
    review_startdate: Date,
    reviewphase_duration: Number,
    close_date: Date,
    type: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Contest', ContestSchema);