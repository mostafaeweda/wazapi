var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    creator   : { type: Schema.ObjectId, ref: 'User' },
    date      : { type: Date, default: Date.now },
    body      : String
});

module.exports = mongoose.model('Comment', Comment);