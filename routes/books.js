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
 * Search books
 */
exports.search = function(req, res, next) { 
    var criteria = req.query.product_criteria || 'title';
    var q = req.query.q;

    if (! q) return next(new Error('Search query not provided !!!'));

    Book.where(criteria, new RegExp(q, 'i'))
        .run(function(err, results) {

        if (err) return next(err);

        res.render('books/search', {
            result: results
        });
    });
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