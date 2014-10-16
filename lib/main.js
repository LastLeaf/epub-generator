'use strict';

var uuid = require('node-uuid');
var handlebars = require('handlebars');

var builder = require('./builder.js');

/*
 *	init an epub creator
 *	options
 *		uuid: the book's uuid
 *		title: the book's title
 *		date: the build date
 *		cover: the cover image path
 */
module.exports = function(options){
	// init default vals
	options.uuid = options.uuid || uuid.v4();
	options.title = options.title || '';
};