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

router.post("/friend", (req, res) => {
   const newGameId = uuid.v4();
   const board = Array.from({ length: 15 }, () => Array(15).fill(""));
   const name = "Nová přátelská hra"
   const playerX  = req.session.user.name
   const public = 0;
    db.run("INSERT INTO tda_piskvorky(uuid, name, board, public, playerX) VALUES(?,?,?,?,?)", [newGameId, name, JSON.stringify(board), public,playerX],
        function (err){
            if(err){
                res.status(500).json({
                    message: "Operace úspěšně selhala"
                })
            }else{
                res.status(201).json({
                    message: "Ok",
                    uuid: newGameId
                })
            }
        }
    )
});

router.get("/friend/:gameid/:userid", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }

    const username = req.session.user.name;
    const { gameid, userid } = req.params;
    const siteAdress = "https://ecb7937d.app.deploy.tourde.app/login/";

    db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [gameid], (err, game) => {
        if (err || !game) {
            return res.status(404).send("Hra nenalezena.");
        }

        let playerX = game.playerX;
        let playerO = game.playerO;

        // Pokud už je ve hře hráč X, druhého hráče nastavíme jako O
        if (!playerO && username !== playerX) {
            playerO = username;

            // Uložíme ho do databáze
            db.run("UPDATE tda_piskvorky SET playerO = ? WHERE uuid = ?", [playerO, gameid]);
        }

        res.render("freeplay", {
            title: "Přátelská hra",
            board: JSON.parse(game.board), // pokud je board uložen jako JSON string
            playerX,
            playerO,
            linkToGame: siteAdress + gameid
        });

        // Odeslat zprávu přes WebSocket
        const io = req.app.get("io");
        io.to(gameid).emit("playerJoined", { playerX, playerO });
    });
});


module.exports=router