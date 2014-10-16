'use strict';

var fs = require('fs');
var handlebars = require('handlebars');
var ZipStream = require('zip-stream');

// static files
var STATIC_FILES = ['mimetype', 'META-INF/', 'META-INF/container.xml', 'OEBPS/'];
var addStaticFiles = function(zipStream){
	STATIC_FILES.forEach(function(file){
		if(file.slice(-1) === '/') archive.entry(null, { name: file });
		else archive.entry(fs.createReadStream('templates/'+file), { name: file });
	});
};

// content.opf
var addContentOpf = function(){
};

module.exports = function(options){
	var zipStream = new ZipStream();
	addStaticFiles(zipStream);
	return {
		add: function(){},
		finish: function(cb){
			zipStream.finish();
			// TODO
		}
	};
};