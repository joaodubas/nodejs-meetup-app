'use strict';
/* jshint expr: true */
/* global describe, it */
var expect = require('chai').expect;
var Note = require('../models').Note;

describe('CRUD operations on Note', function () {
  Note._key = 'test_note';

  it('create a new note', function (done) {
    var details = {
      note: 'new note',
      complete: false
    };
    Note.create(details, function (err, note) {
      expect(note.note).to.be.equal(details.note);
      expect(note.complete).to.be.equal(details.complete);
      expect(note.slug).to.not.be.empty();
      expect(note._id).to.not.be.empty();
      done();
    });
  });

  it('remove a note', function (done) {
    var details = {
      note: 'new note',
      complete: false
    };
    Note.create(details, function (err, note) {
      Note.remove(note.slug, done);
    });
  });

  it('remove a note instance', function (done) {
    var details = {
      note: 'new note',
      complete: false
    };
    Note.create(details, function (err, note) {
      note.remove(done);
    });
  });
});
