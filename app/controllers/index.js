'use strict';
var fs = require('fs');
var path = require('path');
var stream = require('stream');
var util = require('util');

var jade = require('jade');

var Note = require('../models').Note;

exports.list = list;
exports.create = create;
exports.done = done;
exports.remove = remove;

/**
 * Convert a stream of objects into a stream of Bytes
 */
var TEMPLATE = '';
(function () {
  var root = path.join(process.cwd(), 'views', 'partial', 'note.jade');
  var options = {'encoding': 'utf-8'};
  fs.readFile(root, options, function (err, content) {
    if (err) {
      throw err;
    }
    TEMPLATE = jade.compile(content);
  });
})();
util.inherits(RenderStream, stream.Transform);
function RenderStream(options) {
  if (!this instanceof RenderStream) {
    return new Render(options);
  }
  stream.Transform.call(this, options);
  this._writableState.objectMode = true;
  this._readableState.objectMode = false;

}
RenderStream.prototype._transform = function _transform(chunk, encoding, callback) {
  var note = JSON.parse(chunk.value);
  this.push(TEMPLATE(note));
  callback();
};
RenderStream.prototype._flush = function _flush(callback) {
  callback();
};

/**
 * List note instances
 */
function list(req, res, next) {
  var stream = Note.all();
  var transform = new RenderStream();
  stream.pipe(transform).pipe(res);
}

/**
 * Create a note instance.
 */
function create(req, res, next) {
  var details = {
    note: req.body.note
  }
  Note.create(details, function (err, note) {
    res.render(
      'partial/note',
      {note: note.note, slug: note.slug}
    );
  });
}

/**
 * Mark note instance as done.
 */
function done(req, res, next) {}

/**
 * Remove a note instance.
 */
function remove(req, res, next) {
  Note.remove(req.params.slug, function (err, note) {
    res.render(
      'partial/message',
      {message: 'Nota: <strong>' + note.note + '</strong> removida com sucesso!'}
    );
  });
}
