'use strict';

var fs = require('fs');
var epubGenerator = require('../index.js');

var xhtml = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>HELLO</title></head><body>Hello world from epub-generator!</body></html>';

var epubStream = epubGenerator({ title: 'Hello World' })
	.file('index.xhtml', xhtml, {title: 'HELLO', mimetype: 'application/xhtml+xml', toc: true})
	.end().pipe( fs.createWriteStream('basic.epub') );

epubStream.on('error', function(err){
	console.trace(err);
});