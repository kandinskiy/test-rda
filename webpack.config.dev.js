const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');

const webpackDev = merge(webpackConfig, {
  mode: 'development',
  devServer: {
    client: {
      overlay: true,
    },
    port: 8081,
  },
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map"
    }),
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(webpackDev)
});