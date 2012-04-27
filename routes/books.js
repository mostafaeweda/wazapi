var app = require('../app');

var per_page = app.config.per_page;

var Book = app.Schema.Book;

exports.comments = require('./comments');
exports.tags = require('./tags');

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

exports.newBooks = function(req, res, next) {
  var page = +req.param.page;

  Book.sort('uploadDate', 1).skip(page*per_page)
      .limit(per_page).find(function (err, books) {
          if (err) return next(err);

          res.render('books/box', { books: books });
      });
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