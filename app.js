// Fetch the site configuration
var config = require('./config');

process.title = config.uri.replace(/http:\/\/(www)?/, '');

process.addListener('uncaughtException', function (err, stack) {
  console.log('Caught exception: '+err+'\n'+err.stack);
  console.log('\u0007'); // Terminal bell
//  if (airbrake) { airbrake.notify(err); }
});

var express = require('express');
//var assetManager = require('connect-assetmanager');

var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);
var Schema = require('./db/schema');

var RedisStore = require('connect-redis')(express);
 // var sessionStore = new RedisStore(config.redisOptions);

var app = module.exports = express.createServer();
app.config = config;
app.Schema = Schema;

var Auth = require('./lib/auth');

app.listen(config.internal_port, null);

if (process.argv.length > 2 && process.argv[2] === '--init') {
  console.log('Initializing DB');
  require('./db/init')(app, function() {
    console.log('DB initialized');
    process.exit();
  });
}

// var assetsSettings = {
//   'js': {
//     'route': /\/static\/js\/[^]+\.js/
//     , 'path': './public/js/'
//     , 'dataType': 'javascript'
//     , 'files': [
//       'jquery-latest.js'
// //      , siteConf.uri+'/socket.io/socket.io.js' // special case since the socket.io module serves its own js
//     ]
//     , 'debug': true
// /*    , 'postManipulate': {
//       '^': [
//         assetHandler.uglifyJsOptimize
//         , function insertSocketIoPort(file, path, index, isLast, callback) {
//           callback(file.replace(/.#socketIoPort#./, siteConf.port));
//         }
//       ]
//     }*/
//   }
//   , 'css': {
//     'route': /\/static\/css\/[^]+\.css/
//     , 'path': './public/css/'
//     , 'dataType': 'css'
//     , 'files': [
//       'style.css'
//     ]
//     , 'debug': true
// /*    , 'postManipulate': {
//       '^': [
//         assetHandler.fixVendorPrefixes
//         , assetHandler.fixGradients
//         , assetHandler.replaceImageRefToBase64(__dirname+'/public')
//         , assetHandler.yuiCssOptimize
//       ]
//     }*/
//   }
// };

//var assetsMiddleware = assetManager(assetsSettings);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });

  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.logger({format: ':response-time ms - :date - :req[x-real-ip] - :method :url :user-agent / :referrer'}));

  // app.use(assetsMiddleware);

  var stylus = require('stylus');

  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', false);
  }

  app.use(stylus.middleware({
      src: __dirname + '/public',
      dest: __dirname + '/public',
      compile: compile
  }));

  app.use(express.favicon());
  app.use(express.session({
//    'store': sessionStore,
    'secret': config.sessionSecret
  }));

  app.use(Auth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.all('/robots.txt', function(req,res) {
    res.send('User-agent: *\nDisallow: /', {'Content-Type': 'text/plain'});
  });
});

app.configure('production', function(){
  app.use(express.errorHandler());
  app.all('/robots.txt', function(req,res) {
    res.send('User-agent: *', {'Content-Type': 'text/plain'});
  });
});

// Template helpers
app.dynamicHelpers({
  // 'assetsCacheHashes': function(req, res) {
  //   return assetsMiddleware.cacheHashes;
  // },
  session: function(req) {
    return req.session;
  },

  req: function(req) {
    return req;
  },

  hasMessages: function(req) {
    if (!req.session) return false;
    return Object.keys(req.session.flash || {}).length;
  },

  messages: function(req) {
    return function() {
      var msgs = req.flash();
      console.log('msgs: ', msgs);
      return Object.keys(msgs).reduce(function(arr, type){
        return arr.concat(msgs[type]);
      }, []);
    }
  }
});

app.helpers({
  staticPrefix: '',
  appName: 'Wazapi'
});

// Error handling

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

app.error(function(err, req, res, next){
  // Log the error to Airbreak if available, good for backtracking.
  console.log(JSON.stringify(err));

  if (err instanceof NotFound) {
    res.render('errors/404');
  } else {
    res.render('errors/500');
  }
});

// Routing
var routes = require('./routes');

app.get('/', routes.index);

app.get('/books/search', routes.books.search);
app.get('/books/popup/:bookId([0-9a-f]+)', routes.books.popup);
app.post('/books/rent/:bookId([0-9a-f]+)/:instanceId([0-9a-f]+)?', routes.books.rent);
app.post('/books/change_availability/:instanceId([0-9a-f]+)', 
	routes.books.changeAvailability);
app.get('/books/tags/:tagId([0-9a-f]+)?', routes.books.tags.search);
app.post('/books/:bookId([0-9a-f]+)/comments', routes.books.comments.create);

app.get('/users/:userId([0-9a-f]+)', routes.users.profile);
app.get('/users/:userId([0-9a-f]+)/:type([1-2])', routes.users.updateBooks);

Auth.helpExpress(app);

// If all fails, hit em with the 404
// This will be enabled when using assetManager
/*
app.all('*', function(req, res){
  throw new NotFound;
});
*/

console.log('Running in ' + ( process.env.NODE_ENV || 'development' ) + ' mode @ ' + config.uri);