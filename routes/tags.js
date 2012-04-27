var app = require('../app');

var per_page = app.config.per_page;

var Book = app.Schema.Book;
var Tag = app.Schema.Tag;

// Parameter processing
app.param('tagId', function(req, res, next, id) {
  Tag.findById(id, function(err, tag) {
    if (err) return next(err);
    if (!tag) return next(new Error('failed to find tag'));
    req.tag = tag;
    next();
  });
});

/*
 * GET books with the specified tag
 */
exports.search = function(req, res) {
  Book.find({tags: req.tag._id}).sort('rentalHits', -1)
      .limit(per_page).find(function (err, result) {

      if (err) return next(err);

      res.render('books/search', {
          result: result
      });
  });
};