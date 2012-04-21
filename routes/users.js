var app = require('../app');

var User = app.Schema.User;

// Create a user

exports.create = function(req, res) {
  res.render('users/create', { title: 'Express' });
};
