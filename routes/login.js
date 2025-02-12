var express = require('express');
var router = express.Router();

router.get("/", (req, res)=>{
res.render("login",{
    title:"Přihlášení"
})
})

router.get("/new",(req,res)=>{
res.render("register",{
        title: "Registrace"
    })
})

module.exports = router;