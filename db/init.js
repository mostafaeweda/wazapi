var asyncjs = require('asyncjs');
var mongoose = require('mongoose');

module.exports = function (app, callback) {
    var db = mongoose.createConnection(app.config.mongoUrl);

    db.on('open', function () {
        db.db.dropDatabase(function () {
            var User = app.Schema.User;
            var Book = app.Schema.Book;
            var Tag = app.Schema.Tag;

            var users = [];
            var books = [];
            var tags = [];

            asyncjs.list([
                function (callback) {
                    var user = new User({
                        firstname: "Mostafa",
                        lastname: "Eweda",
                        email: "mostafa.eweda17@gmail.com",
                        password: "123456",
                    });
                    users.push(user);
                    user.save(callback);
                },
                // Create tags
                function (callback) {
                    var tagFreqs = [150, 100, 120, 7, 15, 12];
                    var tagNames = ["Sports", "Economics", "Computer Science", "Technical", "Cooking", "Socializm"];
                    var i = 0;
                    asyncjs.list(tagNames)
                        .each(function(name, next) {
                            var tag = new Tag({
                                name: name,
                                frequency: tagFreqs[i],
                            });
                            i++;
                            tags.push(tag);
                            tag.save(next);
                        }).end(function(err, result) {
                            callback(err);
                        });
                },
                function (callback) {
                    var book = new Book({
                        ISBN: "F2FA",
                        title: "Kayf takoon Ba3boo3",
                        coverUrl: app.config.uri + "/favicon.ico",
                        author: "Ahmed El-Bayaa",
                        publisher: "Wazapi",
                        publishDate: new Date(),
                        tags: [tags[0]],
                        owner: users[0]._id,
                        instancesNum: 3,
                        borrowedNum: 2,
                        rentalHits: 5,
                        marketPrice: 15,
                        rentalPrice: 2
                    });
                    books.push(book);
                    book.save(callback);
                },
                function (callback) {
                    var book = new Book({
                        ISBN: "F2FB",
                        title: "Introduction to Eweda",
                        coverUrl: app.config.uri + "/favicon.ico",
                        author: "Mostafa Eweda",
                        publisher: "Wazapi",
                        publishDate: new Date(),
                        tags: [tags[1]],
                        owner: users[0]._id,
                        instancesNum: 2,
                        borrowedNum: 1,
                        rentalHits: 4,
                        marketPrice: 15,
                        rentalPrice: 2
                    });
                    books.push(book);
                    book.save(callback);
                }
            ]).call().end(function(err, result) {
                callback(err);
            });
        });
    });
};