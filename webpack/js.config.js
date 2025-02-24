const CONFIG = {
    mode: '',
    entry: {},
    output: {},
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