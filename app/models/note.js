'use strict';
var slug = require('slug');
var db = require('./db.js');

module.exports = exports = Note;

/**
 * Represents a note instace.
 */
function Note(details) {
  if (!(this instanceof Note)) {
    return new Note(details);
  }

  this.note = details['note'];
  this.complete = details['complete'] || false;
  this.slug = details['slug'] || slug(this.note);
  this._id = this.constructor.setId(this.slug);
}

Note._key = db._makeKey(Note);
Note.all = all;
Note.create = create;
Note.remove = remove;
Note.setId = setId;
Note.prototype.remove = removeInstance;
Note.prototype.toJSON = function () { return toJSON(this); };

/**
 * Convert a note instance into a JSON string.
 * @param {Note} note: instance to be stringified.
 * @return {String} the instance as a JSON string.
 */
function toJSON(note) {
    return JSON.stringify({
      "note": note.note,
      "complete": note.complete,
      "slug": note.slug
    });
}

/**
 * Convert a string of details into a Note instance.
 * @param {String} details: a string representation of a json.
 * @return {Note} the string as a Note instance.
 */
function toNote(details) {
  return new Note(JSON.parse(details));
}

/**
 * Retrieve all notes available in the database
 *
 * @return {Stream}: a readable stream with objectMode set to true
 */
function all() {
  return db.createReadStream({start: this._key, end: this._key + '\xff'});
}

/**
 * Create a new note.
 *
 * @param {Object} details: an object with the note details, the following keys
 * are expected:
 *     * {String} note
 *     * {Boolean} complete
 *     * {String} slug [optional]
 * @param {Function} fn: callback to be executed after the note is persisted,
 * receives an error || null and the note instance.
 */
function create(details, fn) {
  var note = new this(details);
  db.put(
    note._id,
    toJSON(note),
    function (err) {
      fn(err, note);
    }
  );
}

/**
 * Remove the given slug from the database
 * @param {String} slug: slug part of note id.
 * @param {Function} fn: callback to be execute after the note is removed,
 * receives an error || null and the note instance.
 */
function remove(slug, fn) {
  var _id = this.setId(slug);
  db.get(_id, function (err, data) {
    var details = toNote(data);
    db.del(_id, function (err) {
      fn(err, details);
    });
  });
}

/**
 * Change the complete status of a note instance.
 *
 * @param {Function} fn: callback to be execute after the note is persisted,
 * receives an error || null and the note instance.
 */
function change(fn) {
  var self = this;
  this.complete = !this.complete;
  db.put(
    this._id,
    toJSON(this),
    function (err) {
      fn(err, self);
    }
  );

}

/**
 * Remove a note instance.
 *
 * @param {Function} fn: callback to be execute after the note is removed,
 * receives an error || null and the note instance.
 */
function removeInstance(fn) {
  var self = this;
  db.del(
    this._id,
    function (err) {
      fn(err, self);
    }
  );
}

/**
 * Define the id attribute for a given instance.
 */
function setId(slug) {
  return this._key + slug;
}
