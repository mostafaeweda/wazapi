var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookDetails = new Schema({
	ASIN         : { type: String, index: { unique: true, sparse: true } },
	Author       : { type: String, trim: true },
  ISBN         : { type: String},
  Label        : { type: String},
  NumberOfItems: { type: Number},
  NumberOfPages: { type: Number},
  PublishedDate: { type: Date},
  Publisher    : { type: String},
  Title        : { type: String},
  Price        : { type: String},
});

module.exports = mongoose.model('BookDetails', BookDetails);