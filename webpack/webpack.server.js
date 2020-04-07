const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const NodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/index.ts',
  target: 'node',
  devtool: 'inline-source-map',
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  externals: [
    new NodeExternals(),
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../build')
  },

  plugins: [
    new NodemonPlugin(),
  ],
};
