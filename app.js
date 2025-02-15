var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session")
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
var apiRouter = require("./routes/api");
var gameRouter = require("./routes/game");
var botRouter = require("./routes/bot");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout")
var profileRouter = require("./routes/profile")
var statsRouter = require("./routes/stats")
var playRouter = require("./routes/play")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: "Td4p0kusyByC1tr4kGuys",  // Klíč pro podepisování cookies
    resave: false,         // Neuloží session, pokud se nezmění
    saveUninitialized: true, // Uloží novou session i bez změn
    cookie: { secure: false }, // Pokud bys měl HTTPS, dej true
  })
);

app.use(async (req, res, next) => {
  res.locals.logged = req.session.user ? req.session.user : false;

  if (req.session.user) {
      try {
          res.locals.userData = await getUserData(req.session.user.name);
      } catch (err) {
          console.log("Nepodařilo se získat data uživatele ", err);
      }
  }

  next();
});

// ✅ Pomocná funkce, která obalí `db.get()` do `Promise`
function getUserData(username) {
  return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
          if (err) reject(err);
          else resolve(row);
      });
  });
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api",apiRouter);
app.use("/game", gameRouter);
app.use("/experiments", botRouter)
app.use("/login",loginRouter);
app.use("/logout",logoutRouter)
app.use("/profile",profileRouter);
app.use("/stats",statsRouter)
app.use("/play",playRouter);
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
 //pravej alt+h `` (funguje btw jenom na linuxu, ve windows je to pravej alt+nějaký horní číslo idk který)
 db.run("UPDATE tda_piskvorky SET name = name || ' vs unnamedPlayer' WHERE name NOT LIKE '%vs%'");
 db.run("DELETE FROM tda_piskvorky WHERE name='vs'");


app.listen(3000, ()=>{
  console.log("Aplikace běží")
})





module.exports = { app };
