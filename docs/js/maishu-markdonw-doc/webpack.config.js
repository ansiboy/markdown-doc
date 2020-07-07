const webpack = require('webpack');
let pkg = require("./package.json");
let license = `
 ${pkg.name} v${pkg.version}
 
 Copyright (C) maishu All rights reserved.
  
 作者: 麦舒
 日期: 2018/5/30
 
 个人博客：   http://www.cnblogs.com/ansiboy/
 QQ 讨论组：  119038574 
`;
module.exports = {
    entry: __dirname + "/out/application.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/dist", //打包后的文件存放的地方
        filename: "application.js", //打包后输出文件的文件名
        library: "markdown-doc",
        libraryTarget: "umd",

    },
    mode: 'development',
    devtool: 'source-map',
    // externals: ["react", "react-dom"],
    externals: ["../js/highlight/highlight.pack"],
    plugins: [
        new webpack.BannerPlugin(license),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}