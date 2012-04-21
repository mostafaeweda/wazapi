/*
 * Create a comment on a book
 */
exports.create = function(req, res, next) {
  // create a comment
  var book = req.book;
  var comment = {creator: req.user, body: req.body.comment.body};
  book.comments.push(comment);
  console.log(JSON.stringify(comment));
  book.save(function (err) {
    if (err) return next(err);

    res.redirect('/books/' + book._id);
  });
};