var everyauth = require('everyauth');

var app = require('../app');
var User = app.Schema.User;

everyauth.debug = true;
everyauth.everymodule.findUserById( function (userId, callback) {
  User.findById(userId, callback);
});

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login') // Uri path to the login page
    .postLoginPath('/login') // Uri path that your login form POSTs to
    .loginView('users/login')
    .authenticate( function (login, password) {
      var promise = this.Promise();
      User.findByEmail(login, function(err, user) {
        if (err) return promise.fulfill([err]);
        if (user && user.password === password) {
          console.log(user);
          promise.fulfill(user);
        } else {
          promise.fulfill([new Error("Invalid email / password")]);  
        }
      });
      return promise;
    })
    .loginSuccessRedirect('/users/home') 
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('users/create')
//    .registerLocals({
//      title: 'Register'
//    })
//    .registerLocals(function (req, res) {
//      return {
//        title: 'Sync Register'
//      }
//    })
    // .registerLocals( function (req, res, done) {
    //   setTimeout( function () {
    //     done(null, {
    //       title: 'Async Register'
    //     });
    //   }, 200);
    // })
    .validateRegistration( function (newUserAttrs, errors) {
      var promise = this.Promise();
      User.findByEmail(newUserAttrs.email, function(err, user) {
        if (err) return promise.fulfill([err]);
        if (user) return promise.fulfill([new Error("Login already taken")]);

        promise.fulfill();
      });
      return promise;
    })
    .registerUser( function (newUserAttrs) {
      var promise = this.Promise();
      var user = new User();
      user.email = newUserAttrs.email;
      user.password = newUserAttrs.password;
      user.save(function(err) {
        if (err) return promise.fulfill([err]);

        promise.fulfill(user);
      });
      return promise;
    })
    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');

exports.middleware = everyauth.middleware.bind(everyauth);
exports.helpExpress = everyauth.helpExpress.bind(everyauth);