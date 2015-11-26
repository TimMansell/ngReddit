require('angular');

// Init app with dependencies.
module.exports = angular.module('ngReddit', []);

// Dynamically include ng files.
var req = require.context('./ng', true, /^(.*\.(js$))[^.]*$/igm);
req.keys().forEach(function(key){
    req(key);
});