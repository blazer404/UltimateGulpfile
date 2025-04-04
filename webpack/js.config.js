const TerserPlugin = require("terser-webpack-plugin");

const CONFIG = {
    mode: '',
    entry: {},
    output: {
        publicPath: '/web/js/',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: false,
                    keep_fnames: false,
                    compress: {
                        unused: true,
                        drop_console: false
                    },
                    format: {
                        comments: false
                    },
                    mangle: {
                        module: true,
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