'use strict';

var uuid = require('node-uuid');
var handlebars = require('handlebars');

var builder = require('./builder.js');

module.exports = function(options){
	// init default vals
	var opt = {};
	opt.uuid = options.uuid || uuid.v4();
	opt.title = options.title || '';
	opt.language = (options.language || process.env.LANG || 'en').match(/^[-_a-z0-9]+/i)[0].replace(/_/g, '-');
	opt.author = options.author;
	opt.description = options.description;
	opt.rights = options.rights;
	var date = options.date || new Date();
	if(date instanceof Date) {
		var year = date.getFullYear();
		var month = String(date.getMonth() + 1);
		if(month.length < 2) month = '0' + month;
		var monthDate = String(date.getDate());
		if(monthDate.length < 2) monthDate = '0' + monthDate;
		opt.date = year + '-' + month + '-' + monthDate;
	} else {
		opt.date = String(date);
	}
	opt.cover = options.cover;
	return builder(opt);
};