const { resolve } = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const npmPackages = [
  "sweetalert2",
  "moment",
  "moment-timezone",
  "classnames",
  "react-markdown"
];

const corePackages = [
  "react",
  "redux",
  "redux-thunk",
  "react-redux",
  "react-dom",
  "history",
  "qs",
  "axios",
  "push.js",
  "lodash",
  "universal-cookie",
  "node-waves",
  "connected-react-router",
]

module.exports = merge(common, {
  entry: {
    core: corePackages,
    plugins: npmPackages,
  },
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webplatform',
      template: '../template.html',
      chunksSortMode: 'none'
    }),
  ],
})