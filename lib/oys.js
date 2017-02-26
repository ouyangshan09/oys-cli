#!/usr/bin/env node
/**
 * Created by ouyangshan09 on 2017/2/26.
 */
var logger = require('./logger');
var request = require('request');
var chalk = require('chalk');

process.on('exit', fn => {
    console.log('oys-cli on exit');
});

/**
 * http请求
 * */
request({
    url: "https://api.github.com/users/ouyangshan09/repos",
    headers: {
        'User-Agent': 'oys-cli'
    }
}, (error, response, body) => {
    if(error) logger.fatal(error);
    var requestBody = JSON.parse(body);
    if(Array.isArray(requestBody)){
        console.log('Available official templates: ');
        console.log();
        requestBody.forEach(repo => {
            console.log(
                '   ' + chalk.yellow('★') +
                '   ' + chalk.blue(repo.name) +
                '   ' + repo.description);
        });
    }else {
        console.error(requestBody.message);
    }
});