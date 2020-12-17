# koatty_static
Static server Middleware for Koatty.

# 安装
-----

```
npm i koatty_static
```

# 使用
-----

Koatty集成了StaticMiddleware中间件, 但是默认并未开启, 需要修改中间配置开启

3、修改项目中间件配置文件 config/middleware.ts:

```
config: { //中间件配置
    ...,
    // StaticMiddleware: false 如果配置了Nginx代理,请开启此行并注释掉下面配置
    StaticMiddleware: {
        dir: '/static', // resource path
        prefix: '', // the url prefix you wish to add, default to ''
        alias: {}, // object map of aliases. See below
        gzip: true, // when request's accept-encoding include gzip, files will compressed by gzip.
        usePrecompiledGzip: false, // try use gzip files, loaded from disk, like nginx gzip_static
        buffer: false, // store the files in memory instead of streaming from the filesystem on each request
        filter: [], // (function | array) - filter files at init dir, for example - skip non build (source) files. If array set - allow only listed files
        maxAge: 3600 * 24 * 7, // cache control max age for the files, 0 by default.
        preload: false, // caches the assets on initialization or not, default to true. always work together with options.dynamic.
        dynamic: false // dynamic load file which not cached on initialization.
    }
}
```