const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AsyncChunkNames = require('webpack-async-chunk-names-plugin');
const shell = require('shelljs');
const devMode = process.env.NODE_ENV !== 'production';

const babelrc = require(resolve(__dirname, '../babel.config.js'))

const moment = [
  'moment',
  'moment-timezone'
];

const react = [
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'react-markdown',
  'connected-react-router',
  'redux-thunk',
];

const checkPackage = function(packages, module) {
  if (module.context.indexOf('node_modules') === -1) {
    return false;
  }
  
  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

  for (let i in packages) {
    if (packageName.indexOf(packages[i]) > -1) {
      return true;
    }
  }
  
  return false;
}

const vendorsChunk = function(module, chunk) {
  if (module.type === 'javascript/auto' 
    && module.context.indexOf('webplatform-ui') === -1
    // && module.context.indexOf('routes') === -1
    && module.context.indexOf(resolve(__dirname, '../src')) === -1) {
    let command = shell.exec('webplatform-cli config get variables', {silent: true});
    let config = JSON.parse(command);

    if (module.context.indexOf(config['apps-path']) > -1) {
      return false;
    }

    let plugins = moment.concat(react);
    plugins.push('webplatform-ui');

    return !checkPackage(plugins, module);
  } else {
    return false;
  } 
}

const reactChunk = function(module, chunk) {
  return checkPackage(react, module);
}

const momentChunk = function(module, chunk) {
  return checkPackage(moment, module);
}

const webplatformChunk = function(module, chunk) {
  if (module.type === 'javascript/auto' && module.context.indexOf('webplatform-ui') > -1) {
    return true;
  }

  return false;
}

const defaultRoutesChunk = function(module, chunk) {
  if (module.type === 'javascript/auto') {
    let routes = [
      'Admin',
      'Main',
      'JobsRunner',
      'Settings',
    ];

    for (let i in routes) {
      if (module.context.indexOf(resolve(__dirname, '../src')) > -1) {
        return true;
      }
    }
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
    chunkFilename: '[name].[id].[hash].js'
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
        test: /\.less$/,
        use: [
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
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: resolve(__dirname, 'postcss.config')
              }
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
        loader : 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new AsyncChunkNames(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[hash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Webplatform',
      template: '../template.html',
      chunksSortMode: 'none'
    }),
  ],
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: false,
        vendor: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          test: vendorsChunk,
          name: 'vendors',
        },
        react: {
          chunks: 'all',
          name: 'react',
          test: reactChunk,
          enforce: true,
        },
        moment: {
          chunks: 'all',
          name: 'moment',
          test: momentChunk,
          enforce: true,
        },
        routes: {
          chunks: 'all',
          name: 'default-routes',
          test: defaultRoutesChunk,
          enforce: true,
        },
        webplatform: {
          chunks: 'all',
          name: 'webplatform-ui',
          test: webplatformChunk,
          enforce: true,
        },
        // This adds more bloat then having the common modules spread out
        // With the weight of http having this chunk split out across 4 other chunks is a better approach
        // common: {
        //   name: 'common',
        //   minChunks: 2,
        //   chunks: 'async',
        //   priority: 10,
        //   reuseExistingChunk: true,
        //   enforce: true
        // },
        styles: {
          name: 'styles-chunk',
          test: /\.(s*)css$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
      }
    },
  },
  performance: {
    hints: false
  },
}
