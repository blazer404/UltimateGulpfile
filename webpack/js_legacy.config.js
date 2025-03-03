const TerserPlugin = require('terser-webpack-plugin');

const CONFIG = {
    mode: '',
    entry: {},
    output: {
        publicPath: '/web/js/',
        iife: false,
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: false,
                    keep_fnames: false,
                    compress: {
                        unused: false,
                        drop_console: false
                    },
                    format: {
                        comments: false
                    },
                    mangle: {
                        toplevel: false,
                        properties: false
                    }
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