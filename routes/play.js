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




router.put("/friend/:uuid", (req, res) => {
    const { uuid } = req.params;
    const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
  
    if (!uuid) {
      res.status(400).json({ "code": 400, "message": "Bad Request" });
      console.error("kokote posrals to!")
    }
    var { name,board } = req.body
    
    const updatedAt = new Date().toISOString();
    db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [uuid], (err, data) => {
      if (err) {
        console.error("pico posrals to! xD " + err.message)
    
      } else if (!data) {
        res.status(404).json({ "code": 404, "message": "Resource not found" })
        console.error("kokote posrals to!")
      
  
      } else {
        if (!name) {
          name = data.name
          console.log("name nepřišlo, používá se name z databáze")
          
        }
      
        if (!board) {
          board = data.board
          console.log("board nepřišel, používá se board z databáze")
          
        }else{
       
        
          
        }
      }
  

    db.run("UPDATE tda_piskvorky SET board = ?, updatedAt = ? WHERE uuid = ?", [JSON.stringify(board), updatedAt, uuid], (err) => {
        if (err) {
          console.error("GG, něco se dosralo. Nepodařilo se aktualizovat záznam v databázi. " + err.message)
          res.status(500).json({ message: "GG, něco se dosralo. Nepodařilo se aktualizovat záznam v databázi. " + err.message });
          
        } else {
         res.status(200).json({message:"ok",board: JSON.parse(board)
         });
          console.log("ok");
          
        }
      }
  
      ) 
    })
    db.close();
  })

router.get("/friend/:gameid", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }

    const username = req.session.user.name;
    const { gameid} = req.params;
    const siteAdress = "https://ecb7937d.app.deploy.tourde.app/login/";

    db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [gameid], (err, game) => {
        if (err || !game) {
            return res.status(404).send("Hra nenalezena.");
        }

        let playerX = game.playerX;
        let playerO = game.playerO;

        if (!playerX) {
            playerX = username;
            db.run("UPDATE tda_piskvorky SET playerX = ? WHERE uuid = ?", [playerX, gameid]);
        } else if (!playerO && username !== playerX) {
            playerO = username;
            db.run("UPDATE tda_piskvorky SET playerO = ? WHERE uuid = ?", [playerO, gameid]);
        }

        res.render("freeplay", {
            title: "Přátelská hra",
            uuid: game.uuid,
            board: JSON.parse(game.board),
            playerX,
            playerO,
            linkToGame: siteAdress + gameid
        });
    });
});


router.get("/game/:gameid", (req, res)=>{

    const {gameid} = req.params;
  db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [gameid], (err, game) => {
    if (err || !game) {
        return res.status(404).send("Hra nenalezena.");
    }

   res.status(200).json({
    board:game.board
   })
});
})
module.exports = router;