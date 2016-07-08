var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var processEpisodes = require('./ProcessEpisodes');

var app = express();

var processEpisodesData = new processEpisodes();

app.set('port', (process.env.PORT || 5000));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(processEpisodesData.setupRoutes());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(400).send({
    "error": "Could not decode request: JSON parsing failed"
  });
});

//Start the server on a the specified port
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//print stack trace for uncaught exceptions
process.on('uncaughtException', function(err) {
  console.error('#--------- uncaughtException --------#');
  console.error(err);
});

module.exports = app;