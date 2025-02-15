var express = require('express');
var router = express.Router();
var session = require("express-session");
const uuid = require("uuid");
var sqlite3 = require("sqlite3")
var path  = require("path");

const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
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

router.get("/friend", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }

    const gameId = uuid.v4();
    const siteAdress = "https://ecb7937d.app.deploy.tourde.app/play/friend/";
    const board = Array.from({ length: 15 }, () => Array(15).fill(""));
    const username = req.session.user.name;

    db.get("SELECT uuid FROM users WHERE username = ?", [username], (err, data) => {
        if (!err) {
            res.render("freeplay", {
                title: "Přátelská hra",
                board: board,
                playerX: username,
                linkToGame: siteAdress + gameId
            });

            // Pošli zprávu přes WebSocket
            const io = req.app.get("io"); // Tohle získá WebSocket server
            io.to(gameId).emit("newGameCreated", { gameId, playerX: username });
        }
    });
});


module.exports=router