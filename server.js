var http = require('http');
var spider = require('./spider');



function start() {
    function onRequest(req, res) {
        res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
        spider.requestStoryList().then(function (stories) {
            res.write(JSON.stringify({
                stories: stories
            }));
            res.end();
        }).catch(function (err) {
            console.log(err);
        });
    }
    http.createServer(onRequest).listen(3000);
}

module.exports.start = start;