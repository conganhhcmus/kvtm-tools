const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    watch: true,
    entry: './src/web/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [new MiniCssExtractPlugin()],
}
