# epub-generator #

Generate EPUB books with simple API in Node.js.

# development status #

Early development, NOT stable at all.

# API #

`EpubGenerator = require('epub-generator')`

## EpubGenerator( options ) ##

Create and return an epub generator. The generator is also a stream. You can pipe it to another stream.
You need to listen to writableStream's events to get the generation status, such as `drain`, `error`, `finish`, etc.

Options (all optional):
* `uuid` the book's uuid
* `title` the book's title
* `date` the build date
* `cover` the cover image path

## generator.add( path, data, meta ) ##

Add `data` as a file in epub bundle. The `data` can be a string, buffer, or stream.
`path` is the file's path in epub bundle.

Meta (all optional):
* `mimetype` the mimetype to override the default mimetype
* `toc` whether this file should be added to TOC (table of contents)
* `title` the title, used in TOC

## generator.end( callback ) ##

Finish adding data. The `callback` is added to the `finish` event of the stream.

# LICENSE #

MIT