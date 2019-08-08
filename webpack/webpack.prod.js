const { resolve } = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const devMode = process.env.NODE_ENV !== 'production';
const pkg = require(resolve(__dirname, '../package.json'))

const npmPackages = [
  "sweetalert2",
  "classnames",
  "react-markdown"
];

const corePackages = [
  "redux",
  "redux-thunk",
  "react-redux",
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
    main: resolve(__dirname, '../src/index.js'),
    plugins: npmPackages,
    moment: ['moment', 'moment-timezone']
  },
  output: {
    path: resolve(__dirname, '../build/'),
    filename: 'index.js',
    library: pkg.name,
    libraryTarget: 'commonjs2'
  },
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserJSPlugin({}), 
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin(),
  ],
  performance: {
    hints: false
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  }
})