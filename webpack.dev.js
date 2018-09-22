const webpack = require('webpack-merge');
const buildConfigDev = require('./build/dev');

module.exports = webpack([
  require('./build/common'),
  buildConfigDev.dev,
  require('./build/render')(buildConfigDev.serverUrl)
]);
