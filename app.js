// Fetch the site configuration
var config = require('./config');

process.title = config.uri.replace(/http:\/\/(www)?/, '');

process.addListener('uncaughtException', function (err, stack) {
  console.log('Caught exception: '+err+'\n'+err.stack);
  console.log('\u0007'); // Terminal bell
  if (airbrake) { airbrake.notify(err); }
});

var express = require('express');
var assetManager = require('connect-assetmanager');

var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);
var Schema = require('./db/schema');

var RedisStore = require('connect-redis')(express);
// var sessionStore = new RedisStore(config.redisOptions);

var app = module.exports = express.createServer();
app.config = config;

app.listen(config.internal_port, null);

var assetsSettings = {
  'js': {
    'route': /\/static\/js\/[^]+\.js/
    , 'path': './public/js/'
    , 'dataType': 'javascript'
    , 'files': [
      'jquery-latest.js'
//      , siteConf.uri+'/socket.io/socket.io.js' // special case since the socket.io module serves its own js
    ]
    , 'debug': true
/*    , 'postManipulate': {
      '^': [
        assetHandler.uglifyJsOptimize
        , function insertSocketIoPort(file, path, index, isLast, callback) {
          callback(file.replace(/.#socketIoPort#./, siteConf.port));
        }
      ]
    }*/
  }
  , 'css': {
    'route': /\/static\/css\/[^]+\.css/
    , 'path': './public/css/'
    , 'dataType': 'css'
    , 'files': [
      'style.css'
    ]
    , 'debug': true
/*    , 'postManipulate': {
      '^': [
        assetHandler.fixVendorPrefixes
        , assetHandler.fixGradients
        , assetHandler.replaceImageRefToBase64(__dirname+'/public')
        , assetHandler.yuiCssOptimize
      ]
    }*/
  }
};

var assetsMiddleware = assetManager(assetsSettings);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.cookieParser());

  // app.use(assetsMiddleware);

  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .set('warn', true)
      .set('compress', false);
  }
  app.use(require('stylus').middleware({
    src: __dirname + '/public/css',
    dest: __dirname + '/public/css',
    compile: compile
  }));

  app.use(express.favicon());
/*  app.use(express.session({
    'store': sessionStore,
    'secret': config.sessionSecret
  }));*/
  app.use(express.logger({format: ':response-time ms - :date - :req[x-real-ip] - :method :url :user-agent / :referrer'}));
  app.use(express.methodOverride());
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
  'assetsCacheHashes': function(req, res) {
    return assetsMiddleware.cacheHashes;
  },
  'session': function(req, res) {
    return req.session;
  }
});

app.helpers({
  staticPrefix: '',
  name: 'Wazapi'
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

// Parameter processing
app.param('bookId', function(req, res, next, id) {
  console.log('id: ', id);
  Schema.Book.findById(id, function(err, book) {
    if (err) return next(err);
    if (!book) return next(new Error('failed to find post'));
    req.book = book;
    next();
  });
});

// Routing
var routes = require('./routes');

/*
app.post('/posts', function(req, res, next){
  // create a blog post
  var post = new BlogPost(req.body.post);

  post.save(function (err) {
    if (err) return next(err);

    console.log('Success!');
    res.redirect('back');
  });
});

app.put('/posts/:postId', function(req, res, next){
  // create a blog post
  var post = req.post, reqPost = req.body.post;
  for (var attrname in reqPost)
    post[attrname] = reqPost[attrname];
  post.save(function (err) {
    if (err) return next(err);

    res.redirect('posts/' + req.post._id);

  });
  // find, update and save
});

app.get('/posts/:postId[0-9a-f]+', function (req, res) {
  res.render('posts/post', { title: "Blog Post", post: req.post });
});

app.get('/posts/new', function (req, res) {
  console.log("here");
  res.render('posts/edit', { title: "New post", post: {} });
});

app.get('/posts/:postId[0-9a-f]+/edit', function (req, res) {
  res.render('posts/edit', { title: "Edit post", post: req.post });
});
*/

app.get('/', routes.index);
app.get('/books', routes.books.index);
app.get('/books/:bookId([0-9a-f]+)', routes.books.show);
app.post('/books/:bookId([0-9a-f]+)/comments', routes.books.comments.create);



// If all fails, hit em with the 404
// This will be enabled when using assetManager
/*
app.all('*', function(req, res){
  throw new NotFound;
});
*/

console.log('Running in ' + ( process.env.NODE_ENV || 'development' ) + ' mode @ ' + config.uri);
