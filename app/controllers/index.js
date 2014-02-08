'use strict';
var Note = require('../models').Note;

exports.list = list;
exports.create = create;
exports.done = done;
exports.remove = remove;

/**
 * Convert a stream of objects into a stream of Bytes
 */
function toBuffer() {}

/**
 * List note instances
 */
function list(req, res, next) {}

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
