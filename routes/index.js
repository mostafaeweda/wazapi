
/*
 * GET home page.
 */
exports.books = require('./books');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};