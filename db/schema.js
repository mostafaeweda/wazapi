
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
    frequency    : { type: Number, index: true }
});

var Book = new Schema({
    ISBN         : { type: String, index: { unique: true, sparse: true } },
    title        : { type: String, index: true },
    coverUrl     : String,
    author       : { type: String, trim: true },
    publisher    : { type: String, trim: true },
    publishDate  : Date,
    createdDate  : { type: Date, default: Date.now },
    tags         : [{ type: Schema.ObjectId, ref: 'Tag'}],
    comments     : [Comment],
    // The total number of instances available
    instancesNum : { type: Number, default: 0 },
     // The currently borrowed number of instances
    borrowedNum  : { type: Number, default: 0 },
    // Number of times this book has been rented
    rentalHits   : { type: Number, default: 0, index: { sparse: true } },
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
    owner     : { type: Schema.ObjectId, ref: 'User' },
    book      : { type: Schema.ObjectId, ref: 'Book' },
    freeOn    : { type: Date },
    // The owner set it to be available for rental
    available : { type: Boolean, default: false }
});

var Rental = new Schema({
    user         : { type: Schema.ObjectId, ref: 'User' },
    instance     : { type: Schema.ObjectId, ref: 'Instance' },
    startTime    : { type: Date, default: Date.now },
    endTime      : { type: Date },
    chargedPrice : Number
});

// A user purchase
var Purchase = new Schema({
    user      : { type: Schema.ObjectId, ref: 'User' },
    book      : { type: Schema.ObjectId, ref: 'Book' },
    date      : { type: Date, default: Date.now },
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
exports.Rental = mongoose.model('Rental', Rental);