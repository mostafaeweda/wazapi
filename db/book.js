var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = require('./comment');

var Book = new Schema({
  ISBN         : { type: String, index: { unique: true, sparse: true } },
  title        : { type: String, index: true },
  coverUrl     : String,
  author       : { type: String, trim: true },
  publisher    : { type: String, trim: true },
  publishDate  : Date,
  createdDate  : { type: Date, default: Date.now },
  // The date of the first uploaded instance
  uploadedDate : Date,
  tags         : [{ type: Schema.ObjectId, ref: 'Tag'}],
  comments     : [Comment],
  // The total number of instances available
  instancesNum : { type: Number, default: 0 },
   // The currently borrowed number of instances
  borrowedNum  : { type: Number, default: 0 },
  // Number of times this book has been rented
  rentalHits   : { type: Number, default: 0, index: { sparse: true } },
  
  /* TODO put cached statistics here -> instancesNum, borrowedNum, rentalHits
  stats: {
    
  }, */
  pricing: {
    market  : Number,
    rental  : Number
  }
});

/**
 * Methods
 */
Book.methods.findCreator = function (callback) {
  return this.db.model('User').findById(this.creator, callback);
};

Book.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
};

Book.methods.expressiveQuery = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
};

module.exports = mongoose.model('Book', Book);