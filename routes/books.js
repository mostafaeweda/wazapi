var app = require('../app');

var per_page = app.config.per_page;

var Book = app.Schema.Book;
var Instance = app.Schema.Instance;
var Rental = app.Schema.Rental;

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
 * Popup Rent book.
 */
exports.popup = function(req, res, next) {
  var bookId = req.params.bookId;

  Book.findById(bookId).populate('tags')
    .run(function(err, book) {

    if (err) return next(err);

    res.render('books/popup', {
      book: book,
      available: book.instancesNum !== book.borrowedNum
    });
  });
};

/*
 * Rent a book immediately, or enter a rental queue.
 */
exports.rent = function(req, res, next) {
  /* TODO billing the user and email the user
  if (! req.user.billing) {
    // TODO set flash "You have to enter your payment credentials to be able to rent"
    return res.redirect('payment/info');
  }
  */

  var now = new Date();
  Instance.find({book: req.params.bookId, freeOn: {$lt: now}},
    function (err, instances) {

    if (err) return next(err);
    if (instances.length == 0) return next(new Error('No avialable instances for this book'));

    var instance = instances[0];
    // instance is now avialable

    // TODO billing the user and email the user

    // Update the instance's freeOn
    var days = (Number((req.body.instance || {}).days) || 1);
    var freeOn = new Date();
    freeOn.setDate(freeOn.getDate() + days);
    instance.freeOn = freeOn;
    instance.save(function (err) {
      if (err) return next(err);

      new Rental({
        user: req.user,
        instance: instance,
        startTime: now,
        endTime: freeOn,
        chargedPrice: req.book.rentalPrice * days
      }).save(function (err) {
        if (err) return next(err);

        res.send(200);
      });
    });
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