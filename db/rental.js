var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Instance = require('./instance');

var Asyncjs = require('asyncjs');

var Rental = new Schema({
  user         : { type: Schema.ObjectId, ref: 'User' },
  instance     : { type: Schema.ObjectId, ref: 'Instance' },
  startTime    : { type: Date, default: Date.now },
  endTime      : { type: Date },
  chargedPrice : Number
});

Rental.statics.findInstancesByRenter = function (renter, callback) {
  this.find({"user": renter}, {'instance': 1}, function (err, rentals) {
    if (err) return callback(err);

    Asyncjs.list(rentals)
      .map(function(rental, next) {
        // find the instance object and populate the associated book
        Instance.findById(rental.instance).populate('book').run(next);
    }).toArray(callback);
  });
    
};

module.exports = mongoose.model('Rental', Rental);