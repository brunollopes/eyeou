const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PendingTransactions = mongoose.Schema(
    {
        transaction: Object,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        contest: { type: Schema.Types.ObjectId, ref: 'Contest' }
    }, {
        timestamps: true
    });

module.exports = mongoose.model('PendingTransactions', PendingTransactions);