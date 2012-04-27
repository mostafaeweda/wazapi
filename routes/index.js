var app = require('../app');

exports.books = require('./books');
exports.users = require('./users');

var per_page = app.config.per_page;

var Book = app.Schema.Book;
var Tag = app.Schema.Tag;

/*
 * GET home page.
 */
exports.index = function(req, res, next) {
    var tagsNum = 10;

    if (req.session && req.user)
        req.flash('info', 'Successfully logged in ' + req.user.email + '_.');
    // retrieve the newest books

    Book.find({}).sort('uploadDate', 1).limit(per_page).find(function (err, newlyCreatedBooks) {
        if (err) return next(err);

        Book.find({}).sort('rentalHits', 1).limit(per_page).find(function (err, mostRentedBooks) {
            if (err) return next(err);

            Tag.find({}).sort('frequency', 1).limit(tagsNum).find(function(err, tags) {
                if (err) return next(err);

                res.render('index', {
                    newlyCreated: newlyCreatedBooks,
                    mostRented: mostRentedBooks,
                    tags: tags
                });
            });
        });
    });
};

// /books/newBooks