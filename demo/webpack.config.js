const webpack = require('webpack')
const path = require('path')

const babelPlugins = [
  'babel-plugin-transform-object-rest-spread',
  'babel-plugin-syntax-jsx',
  'add-module-exports',
  [
    'babel-plugin-inferno',
    {
      'imports': true
    }
  ]
]

module.exports = {
  entry: {
    app: path.resolve(__dirname, './index.js')
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    port: 9000
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        // babel-loader doesn't pick up the transform-decorators-legacy plugin setting from babelrc entry in packageon
        plugins: babelPlugins
      }
    }]
  },
  resolve: {
    alias: {
      'inferno-mobiledoc-editor': path.resolve(__dirname, '../lib/index.js')
    }
  }
}
