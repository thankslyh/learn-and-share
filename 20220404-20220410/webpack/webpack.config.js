const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    publicPath: './dist',
    filename: 'bundle.js'
  },
  devServer: {
    port: '6666'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}