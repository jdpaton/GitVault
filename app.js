
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , conf = require('./lib/config')
  , models = require('./lib/models')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy
  , Jobs = require('./lib/jobs');


/**
 * Passport Auth Strategy
 */
passport.use(new GoogleStrategy({
    returnURL: 'http://' + conf.get('domain') + ':' + conf.get('port') + '/auth/google/return',
    realm: 'http://' + conf.get('domain') + ':' + conf.get('port')
  },
  function(identifier, profile, done) {
      done(null, 1);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


/**
 * Express JS setup
 */
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || conf.get('webui_port'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: conf.get('session_key') }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/**
 * Define routes
 */
app.get('/', routes.index);
app.get('/add', routes.add);
app.post('/add', routes.add);
app.get('/view/project/:id', routes.view);
app.get('/delete/project/:id', routes.delete);
app.get('/dl/bundle/:id', routes.getBundle);
app.get('/admin', ensureAuthenticated, routes.admin);

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return',
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));

/**
 * Auth Helpers
 */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
      res.redirect('/auth/google')
}

/**
 * Start the HTTP server
 */
server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Gitvault web interface running on port " + app.get('port'));
});

/**
 * Start the websocket server
 */
io = require('socket.io').listen(server);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {
    socket.emit('monitor-heartbeat', {status:'UP'});
    socket.on('monitor-status', function(fn){
      jobs.isAlive(function(err, status){
        fn(status);
      });
    });
});

/**
 *  Start the background job processor
 */
var jobs = new Jobs();
jobs.start();




