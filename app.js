var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { exists } = require('fs');

var app = express();

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

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  try {
    await sequelize.sync();
    console.log('database synced');
  } catch (error) {
    console.log('Unable to sync the database', error);
  }
})();

// 404 error handler
app.use(function(req, res, next) {
  console.log('404 error handler called');
  const err = new Error("It looks like this page doesn't exists.");
  res.status(404);
  res.render('page-not-found', {err});
  next(err);
});

// Global error handler
app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.render('page-not-found', {err});
  } else {
    console.log('500 error handler called');
    err.status = 500;
    err.message = 'Oops! Looks like there was a problem with the server';
    res.status(err.status).render('error', {err});
  }
});


module.exports = app;
