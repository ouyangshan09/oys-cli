/**
 * Created by OUYANG on 2017/3/1.
 * 选项
 */
var path = require('path');
var metadata = require('read-metadata');
var exists = require('fs').existsSync;
var getGitUser = require('./git-user');
var validateName = require('validate-npm-package-name');

module.exports = function options(name, dir) {
    var opts = getMetadata(dir);

    setDefault(opts, 'name', name);
    setValidateName(opts);

    var author = getGitUser();
    if(author){
        setDefault(opts, 'author', author);
    }
    return opts;
};

function getMetadata(dir) {
    var json = path.join(dir, 'meta.json');
    var js = path.join(dir, 'meta.js');
    var opts = {};
    if(exists(json)){
        opts = metadata.sync(json);
    }else if(exists(js)){
        var req = require(path.resolve(js));
        if(req !== Object(req)){
            throw new Error('meta.js needs to expose an object')
        }
        opts = req;
    }
    return opts;
};

function setDefault(opts, key, value) {
    if(opts.scheme){
        opts.prompts = opts.scheme;
        delete opts.scheme;
    }
    var prompts = opts.prompts || (opts.prompts = {})
    if(!prompts[key] || typeof prompts[key] !== 'object'){
        prompts[key] = {
            'type': 'string',
            'default': value
        }
    }else {
        prompts[key]['default'] = value;
    }
};

function setValidateName(opts) {
    var name = opts.prompts.name;
    var customValidate = name.validate;
    name.validate = function (name) {
        var its = validateName(name);
        if(!its.validForNewPackages){
            var errors = (its.errors || []).concat(its.warnings || []);
            return 'Sorry, ' + errors.join(' and ') + '.';
        }
        if(typeof customValidate === 'function'){
            return customValidate(name);
        }
        return true;
    }
};