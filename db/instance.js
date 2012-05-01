var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// A single book instance to be borrowed
var Instance = new Schema({
  owner        : { type: Schema.ObjectId, ref: 'User' },
  book         : { type: Schema.ObjectId, ref: 'Book' },
  createdDate  : { type: Date, default: Date.now },
  freeOn       : Date,
  // The owner set it to be available for rental
  available    : { type: Boolean, default: false }
});

module.exports = mongoose.model('Instance', Instance);