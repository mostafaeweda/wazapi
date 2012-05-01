var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// A user purchase
var Purchase = new Schema({
    user      : { type: Schema.ObjectId, ref: 'User' },
    book      : { type: Schema.ObjectId, ref: 'Book' },
    date      : { type: Date, default: Date.now },
    price     : Number
});

module.exports = mongoose.model('Purchase', Purchase);