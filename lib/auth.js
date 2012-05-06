var everyauth = require('everyauth');
var sechash = require('sechash'); 

var app = require('../app');
var User = app.Schema.User;

everyauth.debug = true;
everyauth.everymodule.findUserById( function (userId, callback) {
  User.findById(userId, callback);
});

everyauth.everymodule.userPkey('_id');

var ext = app.config.external;

everyauth
  .facebook
    .appId(ext.facebook.appId)
    .appSecret(ext.facebook.appSecret)
    .entryPath('/auth/facebook')
    .scope('email')
    .fields('id,name,email,picture')
    .findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
      var promise = this.Promise();
      User.find({"tokens.facebook": accessToken}, function(err, user) { //see conditions
        if (err) return promise.fulfill([err]);
        if (user) {
          promise.fulfill(user);
        } else {
          var user = new User();
          user.tokens.facebook = accessToken;
          user.firstname = fbUserMetadata.name;
          user.picture = fbUserMetadata.picture;
          user.email = fbUserMetadata.email;
          user.save(function(err) {
            if (err) return promise.fulfill([err]);
            promise.fulfill(user);
          });
        }
      });
      return promise;
    })
    .redirectPath('/');

everyauth.google
  .myHostname('http://localhost:3000')
  .appId(ext.google.clientId)
  .appSecret(ext.google.clientSecret)
  .entryPath('/auth/google')
  .callbackPath('/auth/google/callback')
  .scope('https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    var promise = this.Promise();
    //console.log('session: ', sess);
    //console.log('accessToken: ', accessToken);
    //console.log('extra: ', extra);
    //console.log('googleUser: ', googleUser);
      // User.find({"tokens.google": accessToken}, function(err, user) { //see conditions
      //   if (err) return promise.fulfill([err]);
      //   if (user) {
      //     promise.fulfill(user);
      //   } else {
      //     var user = new User();
      //     user.tokens.google = accessToken;
      //     user.firstname = googleUser.name;
      //     user.picture = googleUser.picture;
      //     user.email = googleUser.email;
      //     user.save(function(err) {
      //       if (err) return promise.fulfill([err]);
      //       promise.fulfill(user);
      //     });
      //   }
      // });
      return promise;
  })
  .redirectPath('/');

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login') // Uri path to the login page
    .postLoginPath('/login') // Uri path that your login form POSTs to
    .loginView('users/new-login')
    .authenticate( function (login, password) {
      var promise = this.Promise();
      User.findByEmail(login, function(err, user) {
        if (err) return promise.fulfill([err]);
        if (user) {
          sechash.testHash(password, user.password, function (err, match) {
            if (err) {
              return promise.fail(err);
              return promise.fulfill(['Invalid email / password']);
            }
            if (match) return promise.fulfill(user);
            return promise.fulfill(['Invalid email / password']);
          });
        } else {
          promise.fulfill(['Invalid email / password']);  
        }
      });
      return promise;
    })
    .loginSuccessRedirect('/') 
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('users/new-login')
    .respondToLoginSucceed( function (res, user, data) {
      if (user) {
        res.send('/', 303);
      }
    })
    .respondToRegistrationSucceed( function (res, user, data) {
      res.send('/', 303);
    })
    .respondToLoginFail( function (req, res, errors, login) {
      if (errors.length) res.send(JSON.stringify(errors), 500);
    })
    .respondToRegistrationFail( function (req, res, errors, login) {
      if (errors.length) res.send(JSON.stringify(errors), 500);
    })
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
      var password = newUserAttrs.password;
      delete newUserAttrs[password];
      var user = new User();
      user.email = newUserAttrs.email;
      user.salt = Math.round((new Date().valueOf() * Math.random())) + '';
      user.password = sechash.strongHashSync('md5', password, user.salt, 2000);
      user.save(function(err) {
        if (err) return promise.fulfill([err]);

        promise.fulfill(user);
      });
      return promise;
    })
    .registerSuccessRedirect('/');


exports.middleware = everyauth.middleware.bind(everyauth);
exports.helpExpress = everyauth.helpExpress.bind(everyauth);