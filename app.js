var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// setting the sqlite to verbose debugging mode (https://github.com/TryGhost/node-sqlite3/wiki/Debugging)
const sqlite3 = require('sqlite3').verbose();
// creates database with fileneme db.sqlite in directory './data/'
const fs = require("node:fs");
if(!fs.existsSync(path.join(__dirname, 'data'))){
  // create data directory if it does not exist
  fs.mkdirSync(path.join(__dirname, 'data'));
}
const db = new sqlite3.Database(path.join(__dirname, 'data','data.sqlite'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gamesRouter = require("./routes/games");


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
app.use("/games",gamesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:"Chyba!"});
});

// creates the tourdeapp table in the databace
db.run('CREATE TABLE IF NOT EXISTS tda_citrak_guys (record TEXT)');
db.run(`
  CREATE TABLE IF NOT EXISTS tda_piskvorky (
    uuid VARCHAR(36) PRIMARY KEY,
    game_name TEXT(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    game_state TEXT(255) DEFAULT 'unknown'
)`);
 //pravej alt+h ``

db.close();


module.exports = app;
