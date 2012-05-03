var app = require('../app');

var User = app.Schema.User;
var Book = app.Schema.Book;
var Instance = app.Schema.Instance;
var Rental = app.Schema.Rental;


// Fetching a user by id provided in the url
app.param('userId', function(req, res, next, id) {
  User.findById(id, function(err, userReq) {
    if (err) return next(err);
    if (!userReq) return next(new Error('failed to find user'));
    req.userReq = userReq;
    next();
  });
});


/*
 * Create a user
 */
exports.create = function(req, res) {
    res.render('users/create', { title: 'Express' });
};

exports.profile = function(req, res, next){
  var id1 = req.userReq._id.toString();
  var id2 = req.user._id.toString();
  if (id1 == id2) {
    Instance.findByOwner(req.userReq._id, function (err, ownedBooks) {
      if (err) return next(err);

      Rental.findInstancesByRenter(req.userReq._id, function (err, rentedInstances) {
        if (err) return next(err);

        // Rental.findByOwner(req.userReq._id, function (err, ownedBooksRented) {
          res.render('users/profile', {
            instances: ownedBooks,
            rentedBooks: rentedInstances,
            // ownedBooksRented: ownedBooksRented,
            myProfile : true
          });
        // });
      });
    });
  } else {
    
  }
};
