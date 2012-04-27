var asyncjs = require('asyncjs');
var mongoose = require('mongoose');

module.exports = function (app, callback) {
    var db = mongoose.createConnection(app.config.mongoUrl);

    db.on('open', function () {
        db.db.dropDatabase(function () {
            var User = app.Schema.User;
            var Book = app.Schema.Book;

            var user, book;

            asyncjs.list([
                function (callback) {
                    user = new User({
                        firstname: "Mostafa",
                        lastname: "Eweda",
                        email: "mostafa.eweda17@gmail.com",
                        password: "123456",
                    });
                    user.save(callback);
                },
                function (callback) {
                    var book = new Book({
                        ISBN: "F2FA",
                        title: "Kayf takoon Ba3boo3",
                        coverUrl: app.config.uri + "/favicon.ico",
                        author: "Ahmed El-Bayaa",
                        publisher: "Wazapi",
                        publishDate: new Date(), 
                        owner: user._id,
                        instancesNum: 2,
                        borrowedNum: 1,
                        rentalHits: 5,
                        marketPrice: 15,
                        rentalPrice: 2
                    });
                    book.save(callback);
                },
            ]).call().end(function() {
                callback();
            });
        });
    });
};