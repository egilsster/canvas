const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rules = require('./rules');
const { ESBuildPlugin } = require('esbuild-loader');

const distDir = path.resolve(__dirname, '../dist');

module.exports = {
  mode: 'production',
  entry: ['./src/index.ts'],
  output: {
    filename: 'build.js',
    path: distDir,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  devtool: 'source-map',
  plugins: [
    new ESBuildPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      hash: true,
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8080,
      server: {
        baseDir: 'dist',
      },
      ui: false,
      online: true,
      notify: false,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.jquery': 'jquery',
    }),
  ],
  module: {
    rules,
  },
};
