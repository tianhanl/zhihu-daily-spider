var http = require('http');
var requestStoryList = require('./spider').requestStoryList;



function start() {
    function onRequest(req, res) {
        res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
        requestStoryList().then(function(stories) {
            console.log(stories);
            res.write(JSON.stringify({
                stories: stories
            }));
            res.end();
        }).catch(function(err) {
            console.log(err);
        });
    }
    http.createServer(onRequest).listen(3000);
}

module.exports.start = start;