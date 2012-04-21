
/*
 * GET home page.
 */
exports.books = require('./books');
exports.users = require('./users');


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};