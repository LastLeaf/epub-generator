'use strict';

var uuid = require('node-uuid');
var handlebars = require('handlebars');

var builder = require('./builder.js');

module.exports = function(options){
	// init default vals
	options.uuid = options.uuid || uuid.v4();
	options.title = options.title || ''; // TODO add more optional fields in epub
	return builder(options);
};