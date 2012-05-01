var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rental = new Schema({
  user         : { type: Schema.ObjectId, ref: 'User' },
  instance     : { type: Schema.ObjectId, ref: 'Instance' },
  startTime    : { type: Date, default: Date.now },
  endTime      : { type: Date },
  chargedPrice : Number
});

module.exports = mongoose.model('Rental', Rental);