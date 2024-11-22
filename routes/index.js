var express = require('express');
var router = express.Router();
var port = 3000;
const {sendLogToDiscord} = require("./errorSpotter")

sendLogToDiscord("apka běží")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Think different Academy',
    description: "Přemýšlej jinak. Nauč se hrát piškvorky",
    keywords: "TdA, Think different, SCG, 2025",
    requipment: "Hello TdA"
   });
});



/* router.get("/api", (req, res)=>{
  res.json({
    message: "stepan je kokot",
    note:"api jede",
    organization: "Student Cyber Games"
  })
}) */


module.exports = router;
