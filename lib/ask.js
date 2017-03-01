/**
 * Created by OUYANG on 2017/3/1.
 */
var chalk = require('chalk');
var async = require('async');
var inquirer = require('inquirer');
var evaluate = require('./eval');

// Support types from prompt-for which was used before
var promptMapping = {
    string: 'input',
    boolean: 'confirm'
};

/**
 * Ask questions, return results.
 *
 * @param {Object} prompts
 * @param {Object} data
 * @param {Function} done
 */

module.exports = function ask (prompts, data, done) {
    async.eachSeries(Object.keys(prompts), function (key, next) {
        prompt(data, key, prompts[key], next);
        // console.log(chalk.yellow('key: '), key);
    }, done)
};

/**
 * Inquirer prompt wrapper.
 *
 * @param {Object} data
 * @param {String} key
 * @param {Object} prompt
 * @param {Function} done
 */

function prompt (data, key, prompt, done) {
    // skip prompts whose when condition is not met
    if (prompt.when && !evaluate(prompt.when, data)) {
        return done()
    }

    var promptDefault = prompt.default;
    if (typeof prompt.default === 'function') {
        promptDefault = function () {
            return prompt.default.bind(this)(data)
        }
    }
    //version 3.0.5 code
    inquirer.prompt([{
        type: promptMapping[prompt.type] || prompt.type,
        name: key,
        message: prompt.message || prompt.label || key,
        default: promptDefault,
        choices: prompt.choices || [],
        validate: prompt.validate || function () { return true }
    }]).then(answer => {
        if(Array.isArray(answer[key])){
            data[key] = {};
            answer[key].forEach(multiChoiceAnswer => {
                data[key][multiChoiceAnswer] = true;
            })
        }else {
            data[key] = answer[key];
        }
        done();
    });


    //version 0.12.0 code
    // inquirer.prompt([{
    //     type: promptMapping[prompt.type] || prompt.type,
    //     name: key,
    //     message: prompt.message || prompt.label || key,
    //     default: promptDefault,
    //     choices: prompt.choices || [],
    //     validate: prompt.validate || function () { return true }
    // }], function (answers) {
    //     if (Array.isArray(answers[key])) {
    //         data[key] = {};
    //         answers[key].forEach(function (multiChoiceAnswer) {
    //             data[key][multiChoiceAnswer] = true
    //         })
    //     } else {
    //         data[key] = answers[key]
    //     }
    //     done()
    // })
}

