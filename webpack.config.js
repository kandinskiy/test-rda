const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMqpackerPlugin = require('css-mqpacker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sass = require('sass');

const PATHS = {
  src: path.join(__dirname, './src/'),
  dist: path.join(__dirname, './dist/'),
  asset: path.join(__dirname, './src/asset/'),
};

module.exports = {
  externals: {
    paths: PATHS
  },
  cache: false,
  entry: PATHS.src + 'index.js', // path.join(__dirname, 'src', 'index.js'),
  output: {
    path: PATHS.dist,
    filename: 'js/[name].js',
    clean: true,
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          }, {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {sourceMap: true}
                  ],
                ],
              },
            },
          }, {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        use: [{
          options: {
            name: '[path][name].[ext]',
            quality: 75
          },
          loader: 'file-loader',
        }]
      }
    ]
  },
  devServer: {
    static: {
      directory: PATHS.dist,
      watch: true
    },
    compress: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMqpackerPlugin({
        test: /\.css$/,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: '/node_modules/',
          chunks: "all",
          enforce: true
        }
      }
    },
    runtimeChunk: true,
    usedExports: true,
    concatenateModules: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `css/[name].css`,
      linkType: "text/css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: PATHS.asset + 'images',
          to: PATHS.dist + 'images',
          noErrorOnMissing: true,
        },
        {
          from: PATHS.asset + 'js',
          to: PATHS.dist + 'js/',
          noErrorOnMissing: true,
        },
        {
          from: PATHS.asset + 'styles',
          to: PATHS.dist + 'css/[name].css',
          transform: (content, path) => {
            return sass.compile(path, {style: "compressed"}).css
          },
          noErrorOnMissing: true,
        },
        {
          from: PATHS.asset + 'fonts',
          to: PATHS.dist + 'fonts',
          noErrorOnMissing: true,
        }
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: PATHS.src + 'index.html',
      filename: './index.html',
    }),
  ],
};
