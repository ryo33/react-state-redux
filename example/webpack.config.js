'use strict'

var webpack = require('webpack')
var path = require('path')

var src = path.join(__dirname, '..', 'src')

module.exports = {
  devtool: 'source-map',
  entry: {
    'main': [
      path.join(__dirname, 'src', 'index.js')
    ],
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/js/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      include: [src, path.join(__dirname, './src'),
        path.join(__dirname, '../dist')],
      loader: 'babel',
    }]
  },
  devServer: {
    publicPath: '/js/',
    historyApiFallback: true,
    quiet: true,
  },
}
