const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DevServerConf = require('./webpack.devServer.js')

const npmPackages = [
  "sweetalert2",
  "moment",
  "moment-timezone",
  "classnames",
  "react-markdown-it"
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

module.exports = {
  context: resolve(__dirname, 'src'),
  entry: {
    core: corePackages,
    main: './Root.js',
      // '../assets/less/app.less',
    // fonts:'../assets/scss/inc/_fonts.scss',
    // style: '../assets/less/app.less',
    // style: [
      // '../assets/less/vendors/font-awesome/font-awesome.less',
      // '../assets/less/vendors/material-design-iconic-font/material-design-iconic-font.css',
      // '../assets/scss/app.scss',
    // ],
    plugins: npmPackages,
  },
  output: {
    path: __dirname + '/dist/',
    publicPath: '/',
    filename: '[name].[hash].js',
    sourceMapFilename: '[name].[hash].map',
    chunkFilename: '[id].[hash].js'
  },
  // devtool: 'cheap-eval-source-map',
  // devtool: 'eval',
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: DevServerConf,
  resolve: {
    alias: {
      '~': resolve(__dirname, "./src/"),
      '!': resolve(__dirname, "./assets/"),
      'less': resolve(__dirname, "./src/less"),
      'img': resolve(__dirname, "./assets/img")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          // {
          //   loader: 'eslint-loader',
          //   options: {
          //     formatter: require('eslint-friendly-formatter')
          //     // formatter: require('eslint/lib/formatters/codeframe')
          //   }
          // }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(s*)css$/,
        use:[
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|ico|jpg)$/,
        use: 'url-loader'
      },
      {
        test   : /\.(ttf|eot|svg|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'file-loader?name=assets/fonts/[name].[ext]'
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'CEE-Tools',
      template: '../template.html',
      favicon:'../assets/img/favicon.ico',
      chunksSortMode: 'none'
    }),
    new webpack.NamedModulesPlugin(),
  ],
  performance: {
    hints: false
  }
}
