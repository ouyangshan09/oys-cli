/**
 * Created by ouyangshan09 on 2017/2/26.
 */
var chalk = require('chalk');
var format = require('util').format;

var prefix = ' oys-cli';
var step = chalk.gray('·');

exports.log = function () {
    var msg = format.apply(format, arguments);
    console.log(chalk.white(prefix), step, msg);
};

exports.fatal = message => {
    if(message instanceof Error) message = message.message.trim();
    var msg = format.apply(format, arguments);
    console.error(chalk.red(prefix), step, msg);
    process.exit(1);
};

exports.success = function () {
    var msg = format.apply(format, arguments);
    console.log(chalk.white(prefix), step, msg);
};