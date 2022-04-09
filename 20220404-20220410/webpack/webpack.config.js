const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: process.env.TYPE_ENV ? `./index-${process.env.TYPE_ENV}.js` : './index.js',
  output: {
    publicPath: './',
    filename: process.env.TYPE_ENV ? `bundle-${process.env.TYPE_ENV}.js` : 'bundle.js',
  },
  devServer: {
    port: '6666'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: process.env.TYPE_ENV ? `index-${process.env.TYPE_ENV}.html` : 'index.html',
    })
  ]
}