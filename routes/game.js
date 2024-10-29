var express = require("express")
var router = express.Router();

router.get("/game", (req, res)=>{
    res.render("game",{
        title: "Herní obrazovka",
        user: "(G)host"
    })
})

module.exports = router 