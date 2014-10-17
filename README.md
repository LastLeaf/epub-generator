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
* `uuid` an identifier of the book, will generate one if not given
* `title` the book's title, default to blank
* `language` language of the book, will try to detect system's default language or set to "en" if not given
* `date` the modification date, default to the current date
* `author` author of the book
* `description` some description
* `rights` rights information
* `cover` the cover image path, add the image using methods below

## generator.add( path, data, meta ) ##

Add `data` as a file in epub bundle. The `data` can be a string, buffer, or stream.
`path` is the file's path in epub bundle.

Hint: you can use **XHTML**, CSS and common images in epub bundle.

Meta (all optional):
* `mimetype` the mimetype to override the default mimetype
* `toc` whether this file should be added to TOC (table of contents)
* `title` the title, used in TOC

## generator.end( callback ) ##

Finish adding data. The `callback` is added to the `finish` event of the stream.

# LICENSE #

MIT