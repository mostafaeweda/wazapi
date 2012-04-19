

exports.comments = require('./comments');

/*
 * GET home page.
 */
exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

/*
 * GET home page.
 */
exports.show = function(req, res) {
  res.render('books/book', { title: "Book", book: req.book });
};

/*
 * GET home page.
 */
exports.create = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * GET home page.
 */
exports.update = function(req, res){
  res.render('index', { title: 'Express' });
};