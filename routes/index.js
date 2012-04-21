exports.books = require('./books');
exports.users = require('./users');

/*
 * GET home page.
 */
exports.index = function(req, res) {
  if (req.session && req.user)
    req.flash('info', 'Successfully logged in ' + req.user.email + '_.');
  res.render('index', { title: 'Express' });
};