const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MCEP = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const optimization = () => {
    const config = {
        splitChunks:{
            chunks: 'all'
        }
    };

    if (isProd){
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }

    return config;
}

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: './index.pug',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist/favicon.ico')
            }]
        }),
        new MCEP({
            filename: filename('css')
        }),
        new HtmlWebpackPugPlugin({
            adjustIndent: true,
        }),
    ];

    return base;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.js'],
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: optimization(),
    devServer:{
        port: 4200,
        open: true,
        hot: isDev,
    },
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MCEP.loader, 'css-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            },
            {
                test: /\.s[ac]ss$/,
                use: [MCEP.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
              },
              {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
              },
        ]
    }
}