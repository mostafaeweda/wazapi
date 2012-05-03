var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  firstname  : String,
  lastname   : String,
  email      : { type: String, required: true, index: { unique: true, sparse: true } },
  password   : { type: String, required: true},
  salt       : { type: String, required: true},
  billing    : {},
  tokens     : {facebook : String, google: String},
  alive      : { type: Boolean, default: false }
});

User.statics.findByEmail = function (email, callback) {
  return this.findOne({'email':email}, callback);
};

module.exports = mongoose.model('User', User);