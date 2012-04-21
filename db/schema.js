
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema definition
 */

// recursive embedded-document schema

var Comment = new Schema({
    creator   : { type: Schema.ObjectId, ref: 'User' },
    date      : { type: Date, default: Date.now },
    body      : String
});

var Book = new Schema({
    ISBN         : { type: Number, index: { unique: true, sparse: true } },
    title        : { type: String, index: true },
    author       : { type: String, trim: true },
    publisher    : { type: String, trim: true },
    publishDate  : Date,
    createdDate  : { type: Date, default: Date.now },
    creator      : { type: Schema.ObjectId, ref: 'User' },
    tags         : [String],
    comments     : [Comment],
    instancesNum : Number,
    borrowedNum  : Number,
    marketPrice  : Number,
    rentalPrice  : Number
});

var User = new Schema({
    firstname  : String,
    lastname   : String,
    email      : { type: String, required: true, index: { unique: true, sparse: true } },
    password   : { type: String, required: true},
    billing    : {},
    tokens     : {},
    alive      : { type: Boolean, default: false }
});

// A single instance to be borrowed
var Borrow = new Schema({
    user      : { type: Schema.ObjectId, ref: 'User' },
    object    : Schema.ObjectId,
    type      : { type: String },
    startTime : Date,
    endTime   : Date
});

// A user purchase
var Purchase = new Schema({
    user      : { type: Schema.ObjectId, ref: 'User' },
    object    : Schema.ObjectId,
    type      : { type: String },
    price     : Number
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

User.statics.findByEmail = function (email, callback) {
  return this.findOne({'email':email}, callback);
};

exports.Book = mongoose.model('Book', Book);
exports.User = mongoose.model('User', User);
exports.Borrow = mongoose.model('Borrow', Borrow);
exports.Purchase = mongoose.model('Purchase', Purchase);