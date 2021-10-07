const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        pingpong: path.join(__dirname, 'pingpong.js')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css']
    },
    devServer: {
        open: true,
        hot: true,
        writeToDisk: true,
        contentBase: "./",
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
}
