var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var subdomain = require('subdomain');

require('./models/Project');
require('./models/User');

mongoose.connect('mongodb://localhost/db');

var office = require('./routes/office');
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', [__dirname + '/front', __dirname + '/front/office', __dirname + '/front/website']);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'front')));

//Subdomain
app.use(subdomain({ base : 'localhost', removeWWW : true }));

//Use routes
app.use('/subdomain/office/', office);// office.localhost:3000
app.use('/', index);// localhost:3000

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
