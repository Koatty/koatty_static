/*
 * @Author: richen
 * @Date: 2020-12-16 19:51:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-22 14:18:24
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
 * Koatty Application
 *
 * @export
 * @interface Application
 */
export interface Application {
    rootPath: string;
    config(propKey: string, type: string): any;
    on(event: string, callback: () => void): any;
    once(event: string, callback: () => void): any;
}

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

/**
 *
 *
 * @export
 * @param {OptionsInterface} options
 * @param {*} app Koatty instance
 * @returns {*}  
 */
export function KStatic(options: OptionsInterface, app: Application) {
    options = { ...defaultOptions, ...options };
    if (options.dir === '/' || options.dir === '') {
        options.dir = '/static';
    }

    const opt: staticCache.Options = {
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