/*
Create but not create
*/
exports.create = function(req, res) {
  res.render('users/create', { title: 'Express' });
};
