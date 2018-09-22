const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(serverUrl) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        serverUrl: serverUrl,
        template: 'src/components/index.html',
        filename: 'index.html',
        inject: 'body'
      })
    ],
  };
};