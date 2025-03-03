const TerserPlugin = require('terser-webpack-plugin');

const CONFIG = {
    mode: '',
    entry: {},
    output: {
        iife: false,
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                    compress: {
                        drop_console: false,
                        unused: false
                    },
                    mangle: false
                },
                extractComments: false
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
};

module.exports = CONFIG;