const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ImageSchema = mongoose.Schema(
    {
        image_path: String,
        thumbnail_path: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        contest: { type: Schema.Types.ObjectId, ref: 'Contest' },
        cools: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        approved: Boolean
    }, {
        timestamps: true
    });

module.exports = mongoose.model('Image', ImageSchema);