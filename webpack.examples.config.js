const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: './src/examples/index.ts',
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './examples/index.html',
            inject: 'body',
            filename: 'index.html',
            chunks: ['main'],
        }),

        new UglifyJsPlugin(),

        new CopyWebpackPlugin([
            { from: 'src/assets', to: 'assets' },
        ]),
    ],

    resolve: {
        extensions: [' ', '.html', '.js', '.ts', 'css'],
    },
    module: {
        rules: [
            {
                test: /\.txt$/,
                use: 'raw-loader',
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }],
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },

            /**
             * File loader for supporting images, for example, in CSS files.
             */
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: 'file-loader'
            },

            /* File loader for supporting fonts, for example, in CSS files.
            */
            {
                test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                use: 'file-loader'
            }
        ]
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'), // boolean | string | array, static file location
        port: 3000,
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload
        hot: true,
        inline: true,
        // ...
    },
};