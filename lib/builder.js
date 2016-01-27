'use strict';

var fs = require('fs');
var handlebars = require('handlebars');
var ZipStream = require('zip-stream');
var mime = require('mime');

// static files
var STATIC_FILES = ['mimetype', 'META-INF/container.xml'];

// dynamic files
var DYNAMIC_FILES = ['OEBPS/content.opf', 'OEBPS/toc.ncx'];
var dynamicFilesCompiled = [];
DYNAMIC_FILES.forEach(function(file){
	dynamicFilesCompiled.push( handlebars.compile( fs.readFileSync(__dirname + '/templates/' + file).toString('utf8') ) );
});

handlebars.registerHelper('playOrder', function(index) {
  return index + 1;
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
	var addStaticFiles = function(){
		STATIC_FILES.forEach(function(file){
			addFile(fs.createReadStream(__dirname + '/templates/' + file), { name: file });
		});
	};

	// add dynamic files
	var addDynamicFiles = function(){
		for(var i=0; i<DYNAMIC_FILES.length; i++) {
			addFile(dynamicFilesCompiled[i](options), { name: DYNAMIC_FILES[i] });
		}
	};

	// fill meta
	var fillMeta = function(meta, path, data){
		var r = {};
		r.path = path;
		r.mimetype = meta.mimetype || mime.lookup(path);
		r.toc = !!meta.toc;
		r.title = meta.title || ''; // TODO extract title from data
		return r;
	};

	// return API
	var builder = Object.create(zipStream);
	addStaticFiles();

	// add a string/buffer/stream as a file
	builder.add = function(path, data, meta){
		meta = fillMeta(meta || {}, path, data);
		addFile(data, { name: 'OEBPS/' + path });
		options.files.push(meta);
		return this;
	};
	// end adding files
	builder.end = function(cb){
		addDynamicFiles();
		filePending.push([]);
		if(filePending.length === 1) nextFile();
		if(cb) builder.on('finish', cb);
		return this;
	};
	return builder;
};
