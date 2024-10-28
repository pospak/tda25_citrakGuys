var express = require('express');
var router = express.Router();
var port = 3000;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',
    requipment: "Hello TdA"
   });
});

router.get("/api", (req, res)=>{
  res.json({
    message: "stepan je kokot",
    note:"api jede"
  })
})

router.listen(port,()=>{
  console.log("jsem zapomněl ten shorcut... ale jede to na portu "+port)
})

module.exports = router;
