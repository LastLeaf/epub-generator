'use strict';

var fs = require('fs');
var handlebars = require('handlebars');
var ZipStream = require('zip-stream');

// static files
var STATIC_FILES = ['mimetype', 'META-INF/', 'META-INF/container.xml', 'OEBPS/'];

// dynamic files
var DYNAMIC_FILES = ['OEBPS/content.opf', 'OEBPS/toc.ncx'];
var dynamicFilesCompiled = [];
DYNAMIC_FILES.forEach(function(file){
	dynamicFilesCompiled.push( handlebars.compile( fs.readFileSync(__dirname + '/templates/' + file).toString('utf8') ) );
});

module.exports = function(options){
	var zipStream = new ZipStream();
	options.files = [];
	
	// add file to zip stream
	var filePending = [];
	var nextFile = function(){
		if(!filePending.length) return;
		if(!filePending[0].length) {
			zipStream.finish();
			return;
		}
		zipStream.entry(filePending[0][0], filePending[0][1], function(err){
			filePending.shift();
			if(err) zipStream.emit('error', err);
			else nextFile();
		});
	};
	var addFile = function(file, options){
		filePending.push([file, options]);
		if(filePending.length === 1) nextFile();
	};

	// add static files
	var addBasicFiles = function(){
		STATIC_FILES.forEach(function(file){
			if(file.slice(-1) === '/') addFile(null, { name: file });
			else addFile(fs.createReadStream(__dirname + '/templates/' + file), { name: file });
		});
		for(var i=0; i<DYNAMIC_FILES.length; i++) {
			addFile(dynamicFilesCompiled[i](options), { name: DYNAMIC_FILES[i] });
		}
	};
	
	// return API
	var builder = Object.create(zipStream);
	builder.file = function(path, data, meta){
		if(!meta) meta = {};
		addFile(data, { name: 'OEBPS/' + path });
		options.files.push({path: path, title: meta.title, mimetype: meta.mimetype, toc: meta.toc});
		return this;
	};
	builder.end = function(cb){
		addBasicFiles();
		filePending.push([]);
		if(filePending.length === 1) nextFile();
		return this;
	};
	return builder;
};