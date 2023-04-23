const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');

const webpackBuild = merge(webpackConfig, {
  mode: 'production',
  plugins: []
});

// export buildWebpackConfig
module.exports = new Promise((resolve, reject) => {
  resolve(webpackBuild)
});
