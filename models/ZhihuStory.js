var mongoose = require('mongoose');

var storySchema = mongoose.Schema({
    link: String,
    title: String,
    imageSrc: String,
    time: String
});

var ZhihuStory = mongoose.model('ZhihuStory', storySchema);

module.exports = ZhihuStory;