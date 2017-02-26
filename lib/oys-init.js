#!/usr/bin/env node
/**
 * Created by ouyangshan09 on 2017/2/26.
 */
var download = require('download-git-repo');
var program = require('commander');
var exists = require('fs').existsSync;
var path = require('path');
var home = require('user-home');

var chalk = require('chalk');
var logger = require('./logger');

/**
 * 使用方法
 * */
program
    .usage('<template> [project-name]')
    .option('-c, --clone', 'use git clone')
    .option('--offline', 'use cached template');

/**
 * 帮助说明
 * */
program.on('--help', fn => {
    console.log('  Example: ');
    console.log();
    console.log(chalk.gray('    # create a new project with an official template'));
    console.log('   $ oys init webpack my-project');
    console.log();
    console.log(chalk.gray('    # create a new project straight form a github template'));
    console.log('   $ oys init username/repo my-project');
    console.log();
});

/**
 * 使用方法
 * */
function help() {
    program.parse(process.argv);
    if(program.args.length < 1) return program.help();
}
help();

var template = program.args[0];
var rawName = program.args[1];
var inPlace = !rawName || rawName === '.';
var name = inPlace ? path.relative("../", process.cwd()) : rawName;
var to = path.resolve(rawName || '.');


console.log();
program.on('exit', fn => {
    console.log();
});

if(exists(to)){
    run();
}else {
    run();
}

function run() {
    console.log(chalk.yellow("download template: "), template);
    console.log(chalk.blue("download name: "), to);
    var officialTemplate = 'ouyangshan09/' + template;
    console.log(chalk.blue("officialTemplate name: "), officialTemplate);
    downloadAndGenerate(officialTemplate);
}
function downloadAndGenerate(template) {
    download(template, 'test', to, (err) => {
        console.log(`error: `, err);
    })
}