var superagent = require('superagent');
var cheerio = require('cheerio');

var Story = function(link, title, imageSrc) {
    this.link = link;
    this.title = title;
    this.imageSrc = imageSrc;
};

module.exports = {
    requestStoryList: function() {
        return new Promise(function(resolve, reject) {
            superagent.get('https://daily.zhihu.com')
                .end(function(err, pres) {
                    if (err) {
                        reject(err);
                    }
                    var stories = [];
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
                    resolve(stories);
                });
        });

    }
}