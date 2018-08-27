const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
  filename: 'eds-bundle.css',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname + '/lib',
    filename: 'eds-bundle.js'
  },
  devServer: {
    contentBase: '.'
  },
  module: {
    rules: [{
        test: /\.less$/,
        use: extractLess.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'less-loader'
          }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    extractLess
  ]
};
