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
    if(!req.session.user){
        res.redirect("/game")
    }else{
        res.render("chooseMode",{
            title: "Výběr režimu"
        })
    }
})

router.get("/friend",(req,res)=>{
    
})


module.exports=router