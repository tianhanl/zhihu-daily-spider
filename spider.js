var superagent = require('superagent');
var cheerio = require('cheerio');
var mongo = require('./mongo');


const Story = function (link, title, imageSrc, time) {
    this.link = link;
    this.title = title;
    this.imageSrc = imageSrc;
    this.time = time;
};

const getLatestStories = function () {
    return new Promise(function (resolve, reject) {
        var date = new Date();
        var currentTime = '' + date.getFullYear() +
            '/' + (date.getMonth() + 1) +
            '/' + date.getDate();
        superagent.get('https://daily.zhihu.com')
            .end(function (err, pres) {
                if (err) {
                    reject(err);
                }
                var stories = [];
                var $ = cheerio.load(pres.text);
                var $boxes = $('.main-content-wrap .box');
                $boxes.each(function (index, element) {
                    var $self = $(this);
                    var $linkButton = $self.children('.link-button');
                    var link = $linkButton.attr('href');
                    var title = $linkButton.children('.title').text();
                    var imageSrc = $linkButton.children('.preview-image').attr('src');
                    var currentStory = new Story(link, title, imageSrc, currentTime);
                    stories.push(currentStory);
                });
                resolve(stories);
            });
    });
};



module.exports.requestStoryList = function () {
    var date = new Date();
    var result;
    var currentTime = '' + date.getFullYear() +
        '/' + (date.getMonth() + 1) +
        '/' + date.getDate();
    return new Promise(function (resolve, reject) {
        mongo.ZhihuStory.find({ time: currentTime }, function (err, stories) {
            if (err) {
                console.log(err);
            }
            if (stories.length > 0) {
                resolve(
                    stories.map(function (story) {
                        return {
                            link: story.link,
                            title: story.title,
                            imageSrc: story.imageSrc,
                            time: story.time
                        };
                    }));
            } else {
                getLatestStories().then(function (stories) {
                    stories.forEach(function (story) {
                        var mongoStory = new mongo.ZhihuStory({
                            link: story.link,
                            title: story.title,
                            imageSrc: story.imageSrc,
                            time: story.time
                        });
                        mongoStory.save(function (err) {
                        });
                    });
                    resolve(stories);
                });
            }
        });
    }); // end of return Promise
};