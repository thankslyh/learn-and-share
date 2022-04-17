const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './index.js',
  output: {
    filename: (process.env.TYPE_ENV + '-' || '') + 'bundle1.js',
    path: path.resolve(__dirname, process.env.NODE_ENV)
  },
  devtool: false,
  optimization: {
    usedExports: process.env.TYPE_ENV === 'DCE'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: (process.env.TYPE_ENV + '-' || '') + 'index.html'
    })
  ]
}