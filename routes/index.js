
/*
 * GET home page.
 */
exports.books = require('./books');
exports.users = require('./users');


exports.index = function(req, res) {
	console.log('session: ', req.session, 'user: ', req.session.user);
	if (req.session && req.user)
		req.flash('info', 'Successfully logged in ' + req.user.email + '_.');
  res.render('index', { title: 'Express' });
};