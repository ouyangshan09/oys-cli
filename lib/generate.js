/**
 * Created by OUYANG on 2017/3/1.
 */
var chalk = require('chalk');
var Metalsmith = require('metalsmith');
// var Handlebars = null;
var async = require('async');
var render = require('consolidate').handlebars.render;
var path = require('path');
var multimatch = null;
var getOptions = require('./options');
var logger = require('./logger');
var ask = require('./ask');
var filter = require('./filter');

module.exports = function generate(name, src, dest, done) {
    var opts = getOptions(name, src);
    console.log('opts: ', opts);
    var metalsmith = Metalsmith(path.join(src, 'template'));
    var data = Object.assign(metalsmith.metadata(), {
        destDirName: name,
        inPlace: dest === process.cwd(),
        noEscape: true
    });
    metalsmith
        .use(askQuestions(opts.prompts))
        // .use(filterFiles(opts.filters))
        .use(renderTemplateFiles(opts.skipInterpolation))
        .clean(false)
        .source('.')
        .destination(dest)
        .build(function (err, files) {
            console.log("file: ", files);
            done(err);
            if(typeof opts.complete === 'function'){
                var helpers = {chalk, logger, files};
                opts.complete(data, helpers);
            }else {
                logMessage(opts.completeMessage, data);
            }
        });
    return data;
};

/**
 * 创建询问中间件
 * */
function askQuestions(prompts) {
    return function (files, metalsmith, done) {
        ask(prompts, metalsmith.metadata(), done);
    }
}
/**
 * 创建文件筛选中间件
 * */
function filterFiles(filters) {
    return function (files, metalsmith, done) {
        filter(files, filters, metalsmith.metadata(), done);
    }
}
/**
 * 创建生产模板插件
 * */
function renderTemplateFiles(skipInterpolation) {
    skipInterpolation = typeof skipInterpolation === 'string'
        ? [skipInterpolation]
        : skipInterpolation;
    console.log("skipInterpolation: ", skipInterpolation);
    return function (files, metalsmith, done) {
        var keys = Object.keys(files)
        var metalsmithMetadata = metalsmith.metadata()
        async.each(keys, function (file, next) {
            // skipping files with skipInterpolation option
            if (skipInterpolation && multimatch([file], skipInterpolation, { dot: true }).length) {
                return next()
            }
            var str = files[file].contents.toString()
            // do not attempt to render files that do not have mustaches
            if (!/{{([^{}]+)}}/g.test(str)) {
                return next()
            }
            render(str, metalsmithMetadata, function (err, res) {
                if (err) return next(err)
                files[file].contents = new Buffer(res)
                next()
            })
        }, done)
    }
}

function logMessage(message, data) {
    if(!message) return;
    console.log('logMessage: ', message);
}