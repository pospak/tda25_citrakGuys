var express = require("express")
var router = express.Router();

const model = require("./gameModel");

router.get("/", (req, res)=>{
model.all();
})

router.get("/:uuid", (req, res)=>{
    const {uuid} = req.params;
    model.byUUID(uuid);
})

module.exports = router;