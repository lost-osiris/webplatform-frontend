const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BabiliPlugin = require("babili-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const extractSASS = new ExtractTextPlugin({
  filename: 'scss.[name].[id].bundle.css',
  allChunks: true,
});

const extractLESS = new ExtractTextPlugin({
  filename: 'less.[name].[id].bundle.css',
  allChunks: true,
});

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
    chunkFilename: 'chunk.[id].[hash].js'
  },
  mode: 'production',
  // mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      '~': resolve(__dirname, "./src/"),
      '!': resolve(__dirname, "./assets/"),
      'less': resolve(__dirname, "./src/less"),
      'img': resolve(__dirname, "./assets/img"),
      // 'moment-timezone': resolve(__dirname, './node_modules/moment-timezone/builds/moment-timezone.min.js'),
    },
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
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
              // formatter: require('eslint/lib/formatters/codeframe')
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: extractLESS.extract({
          fallback: 'style-loader',
          use: [
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
        })
      },
      {
        test: /\.(s*)css$/,
        use: extractSASS.extract({
          fallback:[
            {
              loader: 'style-loader'
            }
          ],
          use: [
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
            },
          ]
        })
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
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new MomentLocalesPlugin(),
    new HtmlWebpackPlugin({
      title: 'CEE-Tools',
      template: '../template.html',
      favicon:'../assets/img/favicon.ico',
      chunksSortMode: 'none'
    }),
    extractSASS,
    extractLESS,
    new webpack.NamedModulesPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.less$|\.html$/,
      threshold: 1000,
      minRatio: 0.5
    }),
    // new BundleAnalyzerPlugin()
  ],
  performance: {
    hints: false
  }
}
