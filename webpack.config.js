const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, options) => {

return{
    mode: options.mode,
    entry: {
        app: path.resolve(__dirname, 'src', 'index.tsx')
    },
    output: {
        path: ( options.mode === 'production') ? 
                                            (path.resolve(__dirname, 'dist','public')) : 
                                            (path.resolve(__dirname, 'dev','public')),
        filename: '[name].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },  
    module: {
        rules: [
            {
                test: /.(ts|tsx)$/, 
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname,'src','server')
                ], 
                loader: 'ts-loader'
            },
            {
                test: /.(jsx|js)$/,
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname,'src','server')
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname,'src','server')
                ], 
                use: {
                    loader: 'html-loader',
                },
            },
            {
                test: /\.(jpg|svg)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: { 
                      name: 'assets/[hash].[ext]',
                      limit: 10000,
                    },
                  },
                ],
            },
            {
                test: /\.css$/,
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname,'src','server')
                ], 
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    'css-loader',
                    ],
            },
            {
                test: /\.(s*)css$/,
                use: [
                  { loader: MiniCssExtractPlugin.loader },
                  'css-loader',
                  'sass-loader',
                ],
              },  
        ]
    },
    devServer: {
        historyApiFallback: true,
        compress: true,
        port: 8080
    },
    devtool: ( options.mode === 'production') ? ('none') : ('source-map'),
    optimization: ( ( options.mode === 'production') ) ? ( {
        minimize: true,
        minimizer: [ 
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname,'src','server')
                ]
            }) 
        ],
    }) : ( {} ),
    plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname,'public','index.html'),
          filename: './index.html',
          favicon: path.resolve(__dirname,'public','favicon.png')
        }),
        new MiniCssExtractPlugin({
          filename: 'assets/[name].css',
        }),
      ],
}}