'use strict';
var path = require('path');
var webpack = require('webpack');

// PATHS
var PATHS = {
  app: path.join(__dirname, '/app'),
  node: path.join(__dirname, '../node_modules')
};

module.exports = {
  context: PATHS.app,
  resolve: {
    root: PATHS.node,
  },
  entry: {
    app: PATHS.app + '/assets/js/entry.js'
  },
  output: {
    path: PATHS.app + '/assets/js',
    filename: 'bundle.js',
  }
};