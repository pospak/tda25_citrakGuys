var express = require('express');
var router = express.Router();

var session = require("express-session");

router.use(
  session({
    secret: "Td4p0kusyByC1tr4kGuys",  // Klíč pro podepisování cookies
    resave: false,         // Neuloží session, pokud se nezmění
    saveUninitialized: true, // Uloží novou session i bez změn
    cookie: { secure: false }, // Pokud bys měl HTTPS, dej true
  })
);

router.get("/",(req,res)=>{
req.session.destroy(() => {
      res.redirect("/"); // Po odhlášení zpět na homepage
    });
})


module.exports = router ;
  