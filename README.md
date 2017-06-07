# zhihu-daily-spider

## Description
This program will collect the list of latest stories from daily.zhihu.com.

To collect the information, it uses sugeragent to make the request and use cheerio to extract the necessary information.

To cache the informaiton, it uses mongoose to store into and retrive from mongodb.

## Usage
After cloning this program, run `npm install` to install the necessary modules.
To run this program, use `node index.js`. This will start a http server to disply the result collected from Zhihu Daily.
