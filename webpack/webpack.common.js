const { resolve } = require('path');
const { GenerateSW } = require("workbox-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const shell = require('shelljs');
const devMode = process.env.NODE_ENV !== 'production';

const webplatformChunk = function(module, chunk) {
  if (module.type === 'javascript/auto' && module.context.indexOf('webplatform-ui') > -1) {
    return true;
  }

  return false;
}

module.exports = {
  context: resolve(__dirname, '../src/'),
  entry: {
    App: resolve(__dirname, '../src/Root.js'),
  },
  output: {
    path: resolve(__dirname, '../dist/'),
    publicPath: '/',
    filename: '[name].[hash].js',
    sourceMapFilename: '[name].[hash].map',
    chunkFilename: '[name].[hash].js',
  },
  resolve: {
    modules: [resolve(__dirname, '../node_modules/')],
    alias: {
      '~': resolve(__dirname, '../src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ],
              cwd: resolve(__dirname, '../'),
            }
          },
        ]
      },
      {
        test: /\.(s*)css$/,
        use:[
          {
            loader: 'style-loader',
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: devMode,
              sourceMap: true,
            },
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
          },
        ]
      },
      {
        test: /\.(png|ico|jpg)$/,
        use: 'url-loader'
      },
      {
        test   : /\.(ttf|eot|svg|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new GenerateSW({
      chunks: ["App", "vendors", "webplatform-ui"]
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].[hash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Webplatform',
      template: '../template.html',
      chunksSortMode: 'none',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/i,
          chunks: "all"
        },
        styles: {
          name: 'styles-chunk',
          test: /\.(s*)css$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
        webplatform: {
          chunks: 'all',
          name: 'webplatform-ui',
          test: webplatformChunk,
          enforce: true,
        },
        // commons: {
        //   name: "commons",    // The name of the chunk containing all common code
        //   chunks: "initial", 
        //   minChunks: 2        // This is the number of modules
        // }
      }
    },
    runtimeChunk: {
      name: "runtime"
    }
  },
  performance: {
    hints: false
  },
}
