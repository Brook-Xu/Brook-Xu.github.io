const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    historyApiFallback: true,
    port: 8080,
    hot: true,
    open: true
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { 
        test: /\.(png|jpg|gif|svg)$/, 
        loader: 'file-loader', 
        options: { 
          name: '[name].[ext]',
          outputPath: 'assets/',
          publicPath: '/assets/'
        } 
      },
      {
        test: /\.(mp4|webm|ogg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/',
          publicPath: '/assets/'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    // 定义环境变量，使前端代码可以访问 process.env
    new webpack.DefinePlugin({
      'process.env': {
        VUE_APP_API_BASE_URL: JSON.stringify(process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api/auth'),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ]
};
