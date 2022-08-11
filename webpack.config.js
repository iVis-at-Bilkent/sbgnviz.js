var webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
const SRC_DIR = './src';
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const NodeExternals = require('webpack-node-externals');
const CopyPlugin = require("copy-webpack-plugin");

let config = {
  devtool: 'eval-source-map',

  // entry point - src/index.js
  entry: path.join(__dirname, SRC_DIR, 'index.js'),

  // webpack throws warning if not provided a default mode
  // use the 'build:dev' script if you want development mode with non-minified file
  // this mode is used in 'build' script
  mode: 'development',
  output: {
    publicPath: '/',
    path: path.join( __dirname ),
    filename: pkg.name + '.js',
    library: pkg.name,
    libraryTarget: 'umd',
   
  },
  // loader
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: 'babel-loader' 
      }
    ]
  },
  // minimize file if mode is production
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.IgnorePlugin({resourceRegExp: /^fs$/ }),
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
      {from: '**/*.wasm', to: path.resolve('./',  '[name][ext]'),} ],
      }),
  ],

  externals: [NodeExternals()],
  
  devServer: {
    contentBase: [
      path.join(__dirname,'src'),
      path.join(__dirname,'node_modules','libsbmljs_stable')
    ]
  },
  
};

module.exports = config;
