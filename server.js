var superagent = require('superagent');
var cheerio = require('cheerio');
var http = require('http');

var Story = function(link, title, imageSrc) {
    this.link = link;
    this.title = title;
    this.imageSrc = imageSrc;
};

var stories = [];

function start() {
    function onRequest(req, res) {
        res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
        superagent.get('https://daily.zhihu.com')
            .end(function(err, pres) {
                if (err) {
                    console.log(err);
                    return;
                }
                var $ = cheerio.load(pres.text);
                var $boxes = $('.main-content-wrap .box');
                $boxes.each(function(index, element) {
                    var $self = $(this);
                    var $linkButton = $self.children('.link-button');
                    var link = $linkButton.attr('href');
                    var title = $linkButton.children('.title').text();
                    var imageSrc = $linkButton.children('.preview-image').attr('src');
                    var currentStory = new Story(link, title, imageSrc);
                    stories.push(currentStory);
                });
                console.log(stories);
                res.write(JSON.stringify({
                    stories: stories
                }));
                res.end();
            });
    }
    http.createServer(onRequest).listen(3000);
}

exports.start = start;