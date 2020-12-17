/*
 * @Author: richen
 * @Date: 2020-12-16 19:51:00
 * @LastEditors: linyyyang<linyyyang@tencent.com>
 * @LastEditTime: 2020-12-17 19:19:46
 * @License: BSD (3-Clause)
 * @Copyright (c) - <richenlin(at)gmail.com>
 */
import path from "path";
import * as lib from "koatty_lib";
import LRU from "lru-cache";
import staticCache from "koa-static-cache";

/** @type {*} */
const files: any = new LRU({ max: 1000 });

/**
 *
 *
 * @interface OptionsInterface
 */
interface OptionsInterface {
    dir: string;
    prefix: string;
    alias: any;
    gzip: boolean;
    usePrecompiledGzip: boolean;
    buffer: boolean;
    filter: any[];
    maxAge: number;
    preload: boolean;
    cache: boolean;
}

/**
 * default options
 */
const defaultOptions: OptionsInterface = {
    dir: '/static', // resource path
    prefix: '', // the url prefix you wish to add, default to ''
    alias: {}, // object map of aliases. See below
    gzip: true, // when request's accept-encoding include gzip, files will compressed by gzip.
    usePrecompiledGzip: false, // try use gzip files, loaded from disk, like nginx gzip_static
    buffer: false, // store the files in memory instead of streaming from the filesystem on each request
    filter: [], // (function | array) - filter files at init dir, for example - skip non build (source) files. If array set - allow only listed files
    maxAge: 3600 * 24 * 7, // cache control max age for the files, 0 by default.
    preload: false, // caches the assets on initialization or not, default to true. always work together with options.dynamic.
    cache: false // dynamic load file which not cached on initialization.
};

export function Static(options: OptionsInterface, app: any) {
    options = { ...defaultOptions, ...options };
    // static path
    if (options.dir === '/' || options.dir === '') {
        options.dir = '/static';
    }

    const opt: any = {
        dir: path.join(app.rootPath || process.env.ROOT_PATH || '', options.dir),
        prefix: options.prefix,
        alias: options.alias,
        gzip: options.gzip,
        usePrecompiledGzip: options.usePrecompiledGzip,
        maxAge: options.maxAge,
        dynamic: options.cache,
    };
    if (!lib.isEmpty(options.filter) || lib.isFunction(options.filter)) {
        opt.filter = options.filter;
    }
    if (options.cache) {
        opt.files = files;
    }
    /*eslint-disable consistent-return */
    return staticCache(opt);
}