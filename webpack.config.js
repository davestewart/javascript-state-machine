// libs
var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

// variables
var env = require('yargs').argv.env;
var filename;
var plugins = [
    //new webpack.optimize.CommonsChunkPlugin("components", "components.min.js")
];

// setup
if (env === 'build') {
    plugins.push(new UglifyJsPlugin({minimize: true}));
    filename = 'state-machine.min.js';
} else {
    filename = 'state-machine.js';
}

// config
var config = {
    entry: {
        'main': __dirname + '/src/main.js'
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: filename,
        libraryTarget: "umd"
    },
    devtool: 'source-map',
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
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
        modules: [
            path.resolve('./src'),
            "node_modules"
        ]
    }
};

// export
module.exports = config;
