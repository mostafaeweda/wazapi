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

exports.updateBooks = function(req, res, next){
	var booksType = req.params.type;

	if(!booksType || booksType == 1) { // the user want to display his books
	    Instance.findByOwner(req.userReq._id, function (err, ownedInstances) {
	      if (err) return next(err);
	      res.render('users/update-books', {
	        instances: ownedInstances,
	        myProfile : true,
	        userId: req.userReq._id
	      });
		});

	}else { // the user want to display the books he rented
		Rental.findInstancesByRenter(req.userReq._id, function (err, rentedInstances) {
        if (err) return next(err);
		res.render('users/update-books', {
	        instances: rentedInstances,
	        myProfile : true,
	        userId: req.userReq._id
        });	    
       });
	}
};

exports.profile = function(req, res, next){
  var id1 = req.userReq._id.toString();
  var id2 = req.user._id.toString();
  
  Instance.findByOwner(req.userReq._id, function (err, ownedInstances) {
	if (err) return next(err);
    	res.render('users/profile', {
	        instances: ownedInstances,
	        myProfile : id1 == id2,
	        userId: req.userReq._id
        });
	});
  }