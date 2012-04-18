// Fetch the site configuration
var config = require('./config');

process.title = config.uri.replace(/http:\/\/(www)?/, '');

process.addListener('uncaughtException', function (err, stack) {
  console.log('Caught exception: '+err+'\n'+err.stack);
  console.log('\u0007'); // Terminal bell
  if (airbrake) { airbrake.notify(err); }
});

var express = require('express');
var routes = require('./routes');

var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);

var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore(config.redisOptions);

var app = module.exports = express.createServer();
app.config = config;

app.listen(config.internal_port, null);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    'store': sessionStore,
    'secret': config.sessionSecret
  }));
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

// Error handling

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

app.error(function(err, req, res, next){
  // Log the error to Airbreak if available, good for backtracking.
  console.log(err);
  if (airbrake) { airbrake.notify(err); }

  if (err instanceof NotFound) {
    res.render('errors/404');
  } else {
    res.render('errors/500');
  }
});

// Routes

app.get('/', routes.index);

// If all fails, hit em with the 404
app.all('*', function(req, res){
  throw new NotFound;
});

console.log('Running in ' + ( process.env.NODE_ENV || 'development' ) + ' mode @ ' + config.uri);
