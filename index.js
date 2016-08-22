'use strict';
//增加一些类似模块封装的东西.如:AMD,CMD头尾包装
var header = require('gulp-header');
var footer = require('gulp-footer');
//
var gulp = require('gulp');

module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        // 主体实现忽略若干行
    });
};