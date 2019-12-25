const rules = require('./rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.ts'],

  output: {
    filename: 'build.js',
    path: 'dist',
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: true,
      comments: false,
    }),
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
