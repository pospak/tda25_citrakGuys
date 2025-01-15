var express = require("express")
var router = express.Router();



router.get("/", (req,res)=>{
    const board = Array.from({ length: 15 }, () => Array(15).fill(""));
    res.render("botPokusy",{
        title: "hra proti počítači",
        board: board
    })
})

module.exports = router;