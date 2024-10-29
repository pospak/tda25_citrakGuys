var express = require('express');
var router = express.Router();
var port = 3000;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',
    requipment: "Hello TdA"
   });
});

router.get('/game', function(req, res, next) {
  res.render("game",{
    title: "Herní obrazovka",
    user: "(G)host"
})
});

router.get("/api", (req, res)=>{
  res.json({
    message: "stepan je kokot",
    note:"api jede",
    organization: "Student Cyber Games"
  })
})


module.exports = router;
