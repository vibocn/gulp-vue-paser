'use strict';
//增加一些类似模块封装的东西.如:AMD,CMD头尾包装

var header = require('gulp-header');
var footer = require('gulp-footer');
var cheerio = require('cheerio');
var validate = require('vue-template-validator');

//
var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var fs = require("fs");
var path = require("path");
//插件名称
const PLUGIN_NAME = "gulp-vue-paser";
//options :{}
module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        // 主体实现忽略若干行
        if (file.isNull()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Null not supported!'));
            return cb();
        }
        if (file.isBuffer()) {
            //将文件内容转成字符串
            var data = file.contents.toString("utf-8");

            var warnings = validate(data);
            warnings.forEach(function (msg) {
                console.log(msg)
            });
            //
            var $ = cheerio.load(data);
            //css字符串
            var cssStr = $("style").html();
            //模板字符串
            var templateHtml = $("template").html();
            templateHtml = templateHtml.replace(/>(\s)*</g, '><').trim();
            //组装
            var script = 'define(functiogti n (require, exports, module) {\n';
            //script = script.replace(/module.exports[ =]+/g, '');
            script += $("script").html();
            script += '\n\tvar _vueTemplate = ' + JSON.stringify(templateHtml) + ';';
            script += '\n\tmodule && module.exports && (module.exports.template = _vueTemplate);\n';
            script += '});';
            //
            file.contents = new Buffer(script,"utf-8");
            //输出js文件
            fs.writeFileSync(options.out+path.basename(file.path,'.vue') + ".js",script,{'encoding':"utf8"});
            //输出css
            fs.writeFileSync(options.out+path.basename(file.path,'.vue') + ".css",cssStr,{'encoding':"utf8"});
        }
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Stream not supported!'));
            //同步读取
            var content = modReplace(fs.readFileSync(file.path).toString("utf-8"));
            file.contents = new Buffer(content,"utf-8");

            return cb();
        }
        // 确保文件进去下一个插件
        this.push(file);
        // 告诉 stream 转换工作完成
        cb();
    });
};