
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./models/index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// load the routes for my books
var booksRouter = require('./routes/books');

var app = express();

// check that the app can connect to the database and sync my models
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('database connection successful');
    await db.sequelize.sync();
  } catch (error) {
    console.error('database connection failed', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// use the books router when someone visits books
app.use('/books', booksRouter);

// show a friendly page when someone visits an address that does not exist
app.use(function(req, res, next) {
  const error = new Error('Sorry, this page could not be found');
  error.status = 404;
  res.status(error.status);
  res.render('page-not-found', { error });
});

// handle unexpected errors in my application
app.use(function(err, req, res, next) {
  if (!err.status) {
    err.status = 500;
  }

  if (!err.message) {
    err.message = 'Sorry, something went wrong';
  }

  console.error(err.status, err.message);
  res.status(err.status);
  res.render('error', { err });
});

module.exports = app;
