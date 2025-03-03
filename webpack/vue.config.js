const {VueLoaderPlugin} = require('vue-loader');

const CONFIG = {
    mode: '',
    entry: {},
    output: {
        publicPath: '/web/vue/',
    },
    performance: {
        hints: false,
    },
    stats: {
        warnings: false,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // additionalData: `@import "./src/frontend/scss/crm/vars_crm.scss";`
                        }
                    },
                ],
            },
            {
                test: /\.png$/,
                use: ['file-loader'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.vue']
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
};

module.exports = CONFIG;