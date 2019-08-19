const { resolve } = require('path');
const glob = require('glob');

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const shell = require('shelljs');

const devMode = process.env.NODE_ENV !== 'production';
const pkg = require(resolve(__dirname, '../package.json'))

const PATHS = {
  src: resolve(__dirname, '../src')
}

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

const  checkPackage = function(packages, module) {
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

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        sourceMap: true,
      }), 
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CompressionPlugin({
      cache: true,
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
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
      }
    },
  },
  performance: {
    hints: false
  }
})