const CONFIG = {
    mode: '',
    entry: {},
    output: {
        publicPath: '/web/js/',
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