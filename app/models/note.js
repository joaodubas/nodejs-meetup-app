'use strict';
var db = require('./db.js');

/**
 * Represents a note instace.
 */
function Note(note) {
  if (!(this instanceof Note)) {
    return new Note(note);
  }

  this.note = note;
  this.complete = false;
  this._slug = null;
}

Note._key = db._makeKey(Note);
Note.all = all;
Note.create = create;
Note.completeAll = completeAll;
Note.prototype.complete = complete;
Note.prototype.remove = remove;

/**
 * Retrieve all notes available in the database
 */
function all() {}

/**
 * Create a new note.
 */
function create() {}

/**
 * Set all notes as completed.
 */
function completeAll() {}

/**
 * Set a note instance to complete.
 */
function complete() {}

/**
 * Remove a note instance.
 */
function remove() {}
