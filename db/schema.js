
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

var Tag = new Schema({
    name         : { type: String, index: { unique: true, sparse: true } },
    type         : { type: String },
    object       : Schema.ObjectId,
    frequency    : { type: Number, index: true },
});

var Book = new Schema({
    ISBN         : { type: String, index: { unique: true, sparse: true } },
    title        : { type: String, index: true },
    coverUrl     : String,
    author       : { type: String, trim: true },
    publisher    : { type: String, trim: true },
    publishDate  : Date,
    createdDate  : { type: Date, default: Date.now },
    owner       : { type: Schema.ObjectId, ref: 'User' },
    tags         : [Tag],
    comments     : [Comment],
    instancesNum : Number, // The total number of instances available
    borrowedNum  : Number, // The currently borrowed number of instances
    rentalHits   : { type: Number, index: { unique: true, sparse: true } }, // Number of times this book has been rented
    marketPrice  : Number,
    rentalPrice  : Number
});

var User = new Schema({
    firstname  : String,
    lastname   : String,
    email      : { type: String, required: true, index: { unique: true, sparse: true } },
    password   : { type: String, required: true},
    billing    : {},
    tokens     : {facebook : String, google: String},
    alive      : { type: Boolean, default: false }
});

// A single instance to be borrowed
var Instance = new Schema({
    user      : { type: Schema.ObjectId, ref: 'User' },
    object    : Schema.ObjectId,
    type      : { type: String },
    startTime : { type: Date, default: Date.now },
    endTime   : Date,
    available : { type: Boolean, default: true }
});

// A user purchase
var Purchase = new Schema({
    user      : { type: Schema.ObjectId, ref: 'User' },
    object    : Schema.ObjectId,
    date      : { type: Date, default: Date.now },
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

exports.Tag = mongoose.model('Tag', Tag);
exports.Book = mongoose.model('Book', Book);
exports.User = mongoose.model('User', User);
exports.Instance = mongoose.model('Instance', Instance);
exports.Purchase = mongoose.model('Purchase', Purchase);