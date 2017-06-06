let mongoose = require('mongoose');
let ZhihuStory = require('./models/ZhihuStorys');

let db = mongoose.connect('mongodb://localhost/zhihu');

db.connection.on('error', function(err) {
    console.log('Cannot connect to database ${err}');
});

db.connection.on('open', function() {
    console.log('Connected');
});

module.exports = { ZhihuStory: ZhihuStory };