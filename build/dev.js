const webpack = require('webpack');
const serverUrl = 'http://localhost:8080';

module.exports = {
  serverUrl: serverUrl,
  dev: {
    devServer: {
      hot: true,
      host: 'localhost',
      port: 3000
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
          API_SERVER_ADDRESS: JSON.stringify(serverUrl)
      })
    ]
  },
};
