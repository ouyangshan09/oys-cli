#!/usr/bin/env node
/**
 * Created by ouyangshan09 on 2017/2/26.
 */

var program = require('commander');

program
    .version(require('../package').version)
    .usage('<command> [options]')
    .command('init', 'generate a new project from a template')
    .command('list', 'list available official template')
    .command('build', 'prototype a new project')
    .parse(process.argv);
