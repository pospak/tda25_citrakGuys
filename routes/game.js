var express = require("express")
var router = express.Router();
var sqlite3 = require("sqlite3")
var path  = require("path");
const uuid = require("uuid");
const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("cs-CZ"); // Formátuje datum do formátu DD.MM.RRRR
    const formattedTime = date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }); // Pouze hodiny a minuty
    return `${formattedDate} ${formattedTime}`;
  };
  
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

    router.get("/:uuid", (req, res) => {
        const {uuid} = req.params;
        db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [uuid], (err, game) => {
          if (err) {
            console.error("Chyba při dotazu do databáze:", err.message);
         
          } else {
              res.render("game", {
                title: game.name,
                data: game,
                board: JSON.parse(game.board),
                formatDate,
              });
            
          }
        });
      });
 
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
      


module.exports = router;