var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'StateMachine';
var fileName = 'state-machine';
var outputFile;
var plugins = [
  //new webpack.optimize.CommonsChunkPlugin("components", "components.min.js")
];

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = '[name].min.js';
} else {
  outputFile = '[name].js';
}

var config = {
  entry: {
    'StateMachine': [__dirname + '/src/StateMachine.js'],
    'StateHelper': [__dirname + '/src/helpers/index.js']
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    //umdNamedDefine: true,
    //libraryTarget: 'var',
    libraryTarget: 'umd',
    filename: outputFile,
    library: '[name]'
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: plugins
};

module.exports = config;
