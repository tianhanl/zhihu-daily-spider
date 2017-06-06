var superagent = require('superagent');
var cheerio = require('cheerio');
var mongo = require('./mongo');


var Story = function(link, title, imageSrc, time) {
    this.link = link;
    this.title = title;
    this.imageSrc = imageSrc;
    this.time = time;
};

module.exports = {
    requestStoryList: function() {
        var date = new Date();
        var currentTime = '' + (date.getMonth() + 1) + '/' + date.getDate;
        mongo.ZhihuStory.find({ time: currentTime }, function(err, stories) {
            if (err) {
                console.log(err);
            }
            if (stories.length > 0) {
                return Promise.resolve(stories.map(function(story) {
                    return {
                        link: story.link,
                        title: story.title,
                        imageSrc: story.imageSrc,
                        time: story.time
                    };
                }));
            } else {
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
                                var currentStory = new Story(link, title, imageSrc, currentTime);
                                var mongoStory = new mongo.ZhihuStory({
                                    link: currentStory.link,
                                    title: currentStory.title,
                                    imageSrc: currentStory.imageSrc,
                                    time: currentStory.time
                                });
                                mongoStory.save(function(err) {
                                    console.log(err);
                                });
                                stories.push(currentStory);
                            });
                            resolve(stories);
                        });
                });
            }
        });
    }
};