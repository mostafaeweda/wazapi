var app = require('../app');

var Book = app.Schema.Book;

exports.comments = require('./comments');

// Parameter processing
app.param('bookId', function(req, res, next, id) {
  Book.findById(id, function(err, book) {
    if (err) return next(err);
    if (!book) return next(new Error('failed to find book'));
    req.book = book;
    next();
  });
});

/*
 * GET all books
 */
exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

/*
 * GET Book page.
 */
exports.show = function(req, res) {
  res.render('books/book', { title: "Book", book: req.book });
};

/*
 * Create a book
 */
exports.create = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * Update a book
 */
exports.update = function(req, res){
  res.render('index', { title: 'Express' });
};