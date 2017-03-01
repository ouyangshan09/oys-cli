#!/usr/bin/env node
/**
 * Created by ouyangshan09 on 2017/2/26.
 */
var ora = require('ora');
var download = require('download-git-repo');
var program = require('commander');
var inquirer = require('inquirer');
var exists = require('fs').existsSync;
var path = require('path');
var home = require('user-home');
var generate = require('./generate');

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
var hasSlash = template.indexOf('/') > -1;
var rawName = program.args[1];
var inPlace = !rawName || rawName === '.';
var name = inPlace ? path.relative("../", process.cwd()) : rawName;
var to = path.resolve(rawName || '.');
var clone = program.clone || false;

var tmp = path.join(home, '.ouyangshan09', template.replace(/\//g, '-'));


/**
 * Padding
 * */
console.log();
program.on('exit', fn => {
    console.log();
});

if(exists(to)){
    // inquirer.prompt([{
    //     type: 'confirm',
    //     message: inPlace
    //         ? '当前目录生成项目?'
    //         : '目录已存在, 确定?',
    //     name: 'ok'
    // }]).then(answers => {
    //     if(answers.ok === true){
    //         run();
    //     }
    // });
    inquirer.prompt([{
        type: 'confirm',
        message: inPlace
            ? '当前目录生成项目?'
            : '目录已存在, 确定?',
        name: 'ok'
    }], function (answers) {
        if(answers.ok === true){
            run();
        }
    })
}else {
    run();
}

function run() {
    console.log(chalk.yellow("template: "), template);
    console.log(chalk.blue("to: "), to);
    // console.log(chalk.blue("hasSlash: "), hasSlash);
    console.log("tmp: ", tmp);
    if(!hasSlash){
        var officialTemplate = 'ouyangshan09/' + template;
        console.log(chalk.blue("officialTemplate: "), officialTemplate);
        downloadAndGenerate(officialTemplate);
    }else {
        // downloadAndGenerate(template);
        console.log(chalk.blue("template: "), template);
    }
    // downloadAndGenerate(officialTemplate);
}
function downloadAndGenerate(template) {
    var spinner = ora('downloading template');
    spinner.start();
    download(template, tmp, { clone: false}, (err) => {
        spinner.stop();
        if(err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim());
        generate(name, tmp, to, function (err) {
            if(err) logger.fatal(err);
            console.log();
            logger.success('Generated "%s".', name);
        });
    })
}