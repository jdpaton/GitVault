
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , models = require('./lib/models')
  , Jobs = require('./lib/jobs');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/add', routes.add);
app.post('/add', routes.add);
app.get('/view/project/:id', routes.view);
app.get('/delete/project/:id', routes.delete);
app.get('/dl/bundle/:id', routes.getBundle);

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Gitvault web interface running on port " + app.get('port'));
});

// Websocket server
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

// Background job processor
var jobs = new Jobs();
jobs.start();

