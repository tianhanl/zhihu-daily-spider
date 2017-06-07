let mongoose = require('mongoose');
let ZhihuStory = require('./models/ZhihuStory');

let db = mongoose.connect('mongodb://localhost/zhihu');

// Since the default mongoose promise library is deprecated, change to use the
// global promise object
mongoose.Promise = global.Promise;

db.connection.on('error', function (err) {
    console.log('Cannot connect to database ${err}');
});

db.connection.on('open', function () {
    console.log('Connected');
});

module.exports = { ZhihuStory: ZhihuStory };