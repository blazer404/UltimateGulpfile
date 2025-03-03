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