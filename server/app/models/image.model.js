const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    contest_name: String,
    user_id: String,
    image_path: String
});

module.exports = mongoose.model('Image', ImageSchema);