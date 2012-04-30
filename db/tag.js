var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = new Schema({
    name         : { type: String, index: { unique: true, sparse: true } },
    frequency    : { type: Number, index: true }
});

module.exports = mongoose.model('Tag', Tag);