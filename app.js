require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport')
const cors = require('cors');
const mongoose = require('mongoose')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const destinyRouter = require('./routes/destiny');
const sessionRouter = require('./routes/sessions');
const fuckOffRouter = require('./routes/fuck-off');
const mailRouter = require('./routes/mail');


require('./configs/db.configs');
require('./configs/passport.config').setup(passport);
const corsConfig = require('./configs/cors.config');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsConfig));
app.use(session({
  secret: process.env.COOKIE_SECRET || 'Super Secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 2419200000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sessions', sessionRouter);
// app.use('/destiny', destinyRouter);
app.use('/users/:id/fuck-offs', fuckOffRouter);
//app.use('/users/:id/fuck-offs', mailRouter)
app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);

  const data = {}

  if(err instanceof mongoose.Error.ValidationError){
    res.status(400);
    for(field of Object.keys(err.errors)) {
      err.errors[field] = err.errors[field].message
    }
    data.errors = err.errors
  } else if (err instanceof mongoose.Error.CastError) {
    error = createError(404, 'Resource not found')
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.err = req.app.get('env') === 'development' ? err : {};

  data.message = err.message;
  res.json(data)
});


module.exports = app;
