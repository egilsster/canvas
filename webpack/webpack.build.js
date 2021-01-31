const path = require('path');
const rules = require('./rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader');

const distPath = path.resolve(__dirname, '../dist');

module.exports = {
  mode: 'production',

  entry: ['./src/index.ts'],

  output: {
    filename: 'build.js',
    path: distPath,
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015', // Syntax to compile to (see options below for possible values)
      }),
    ],
  },

  plugins: [
    new ESBuildPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
      hash: true,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.jquery': 'jquery',
    }),
  ],

  module: {
    rules: rules,
  },
};
