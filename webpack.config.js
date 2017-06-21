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
    plugins.push(new UglifyJsPlugin({minimize: true}));
    outputFile = '[name].min.js';
} else {
    outputFile = '[name].js';
}

function src (file) {
    return __dirname + '/src/' + file;
}

var config = {
    entry: {
        'main': src('main.js')
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "state-machine.js",
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

module.exports = config;
