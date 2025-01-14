var express = require("express")
var router = express.Router();
var sqlite3 = require("sqlite3")
var path  = require("path");
const uuid = require("uuid");
const {getGameState} = require("./gameStateChecker");

const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("cs-CZ"); // Formátuje datum do formátu DD.MM.RRRR
    const formattedTime = date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }); // Pouze hodiny a minuty
    return `${formattedDate} ${formattedTime}`;
  };
  
//get all (odpovídá přímo frontendu)

router.get("/", (req, res)=>{
const board = Array.from({ length: 15 }, () => Array(15).fill(""));
    
        db.all("SELECT * FROM tda_piskvorky", [], (err, rows) => {
            if (err) {
              console.error("Chyba při dotazu do databáze:", err.message); // Zobraz chybovou zprávu
              
            } else {
           
                res.render("games",{
                  title: "Uložené hry",
                  games: rows,
                  board: board,
                  formatDate
                })
            }
        });
    });
    //single get (odpovídá přímo frontendu)
    router.get("/:uuid", (req, res) => {
        const {uuid} = req.params;
        db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [uuid], (err, game) => {
          if (err) {
            console.error("Chyba při dotazu do databáze:", err.message);
         
          } else {
            const parts = game.name.split(" vs ") 
                res.render("game", {
                title: game.name,
                data: game,
                player1: parts[0],
                player2: parts[1],
                board: JSON.parse(game.board),
                formatDate,
              });
            
          }
        });
      });
 
      //post (odpovídá formu kterej se zpracovává v public/postParams.js (funkce newGame()))
      router.post("/", (req, res) => {
        const newGameId = uuid.v4();
        const { name, difficulty, board } = req.body;
    
        if (!name) {
            console.error("Něco se dosralo, game_name nebylo přijato.");
            res.status(400).json({ error: "Název hry nebyl přijat." });
            return;
        }
    
        if (!difficulty) {
            console.error("Něco se dosralo, difficulty nebylo přijato.");
            res.status(400).json({ error: "Obtížnost nebyla přijata." });
            return;
        }
    
        const gameState = "opening";
        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();
    
        const boardToSave = board || Array.from({ length: 15 }, () => Array(15).fill(""));
        const boardStr = JSON.stringify(boardToSave);
    
        db.run(
            "INSERT INTO tda_piskvorky(uuid, name, createdAt, gameState, board, difficulty, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [newGameId, name, createdAt, gameState, boardStr, difficulty, updatedAt],
            function (err) {
                if (err) {
                    console.error("Nepodařilo se uložit data do databáze", err);
                    res.status(500).json({ error: "Nepodařilo se uložit data do databáze." });
                    return;
                }
    
                res.json({
                    message: "ok",
                    uuid: newGameId
                });
            }
        );
    });
      


    // put (odpovídá formu kterej se zpracovává v public/postParams.js (funkce updateGame()) nebo automatickýmu scriptu na ukládání boardu v public/gameControler.js)
    router.put("/:uuid", (req, res) => {
      const { uuid } = req.params;
      const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
    
      if (!uuid) {
        res.status(400).json({ "code": 400, "message": "Bad Request" });
        console.error("kokote posrals to!")
      }
      var { name, difficulty, board } = req.body
      
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
          if (!difficulty) {
            difficulty = data.difficulty
            console.log("difficulty nepřišlo, používá se difficulty z databáze")
            
          }
          if (!board) {
            board = data.board
            console.log("board nepřišel, používá se board z databáze")
            
          }else{
          
            if(getGameState(board) != "invalid"){
              var gameState = getGameState(board);
            }else{
              var gameState = data.gameState;
              console.log("Chyba, byl odeslán požadavek na aktualizaci chybného boardu")
            }
          
            
          }
        }
    
     
      db.run("UPDATE tda_piskvorky SET name = ?, difficulty = ?, board = ?, updatedAt = ?, gameState = ? WHERE uuid = ?", [name, difficulty, board, updatedAt, gameState, uuid], (err) => {
          if (err) {
            console.error("GG, něco se dosralo. Nepodařilo se aktualizovat záznam v databázi. " + err.message)
            res.status(500).json({ message: "GG, něco se dosralo. Nepodařilo se aktualizovat záznam v databázi. " + err.message });
            
          } else {
           res.status(200).json({message:"ok"});
            console.log("ok");
            
          }
        }
    
        ) 
      })
      db.close();
    
      router.delete("/:uuid", (req, res) => {
        const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
        const { uuid } = req.params;
        db.run("DELETE FROM tda_piskvorky WHERE uuid=?", [uuid], (err) => {
          if (err) {
            console.error("Smazání hry neproběhlo! " + err.message);
            res.status(500).json({ error: err.message })
           
          } else {
            res.status(204).json({ message: "Hra úspěšně smazána" });;
            console.log("ok")
           
          }
        })
        db.close();
      })
    
    
    
    
    })
    

module.exports = router;