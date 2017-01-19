var rules = require('./rules');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: ['./src/index.ts'],

    output: {
        filename: 'build.js',
        path: 'dist'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    devtool: 'source-map',

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head',
            hash: true
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 8080,
            server: {
                baseDir: 'dist'
            },
            ui: false,
            online: true,
            notify: false
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        })
    ],

    module: {
        rules: rules
    }
};
