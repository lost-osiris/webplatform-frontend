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
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const devMode = process.env.NODE_ENV !== 'production';
const pkg = require(resolve(__dirname, '../package.json'))

const PATHS = {
  src: resolve(__dirname, '../src')
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
    new CleanWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new CompressionPlugin({
      cache: true,
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
    new BundleAnalyzerPlugin(),
  ],
  performance: {
    hints: false
  }
})