var express = require("express")
var router = express.Router();
var sqlite3 = require("sqlite3")
var path = require("path")
const {getGameState} = require("./gameStateChecker");

var bcrypt = require('bcrypt');


const uuid = require("uuid");
const { title, send } = require("process");
const { ifError } = require("assert");
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("cs-CZ"); // Formátuje datum do formátu DD.MM.RRRR
  const formattedTime = date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }); // Pouze hodiny a minuty
  return `${formattedDate} ${formattedTime}`;
};




// Použití:


const { sendLogToDiscord } = require("./errorSpotter")



/* ********************** GAMES ********************** */



//post požadavek na vytvoření nové hry
router.post("/v1/games", (req, res) => {
  const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
  const { name, difficulty } = req.body;
  const allowedSymbols = ["", "X", "O"];
  var { board } = req.body
  if (!name) {
    console.error("něco se dosralo, game_name nebylo přijato")
    return res.status(400).json({ error: "něco se dosralo, game_name nebylo přijato" });
  } else {
    console.log("Game_name přijato" + name);
  }

  if (!difficulty) {
    console.error("něco se dosralo, difficulty nebylo přijato")
    return res.status(400).json({ error: "něco se dosralo, difficulty nebylo přijato" });
  } else {
    console.log("Tady chyba nebude, difficulty přislo")
  }
  // Kontrola rozměrů herního pole
  const isCorrectSize = Array.isArray(board) && board.length === 15 && board.every(row => Array.isArray(row) && row.length === 15);

  // Validace obsahu a rozměrů
  const isValidBoard = isCorrectSize && board.every(row =>
    row.every(cell => allowedSymbols.includes(cell))
  );
  if (!board) board = Array.from({ length: 15 }, () => Array(15).fill(""))
  gameState = getGameState(board); // Určení stavu hry

  if (gameState === "invalid" || !isValidBoard ) {
    
    return res.status(422).json({
      code: 422,
      message: "Sematic error"
    })
    
  }

  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const newGameId = uuid.v4();
  const boardStr = JSON.stringify(board);

  db.run(
    "INSERT INTO tda_piskvorky(uuid, name, createdAt, gameState, board, difficulty, updatedAt) VALUES (?, ?, ?, ?, ?,?,?)",
    [newGameId, name, createdAt, gameState, boardStr, difficulty, updatedAt],
    function (err) {
      if (err) {
        res.status(500).json({
          error: "Došlo k chybě při vytváření záznamu" + err,
        });

      } else {
  
        res.status(201).json({
          "uuid": newGameId,
          "createdAt": createdAt,
          "updatedAt": updatedAt,
          "name": name,
          "difficulty": difficulty,
          "gameState": gameState,
          "board": board // Vrať ID nového záznamu
        })
      }
    }
  );
  db.run("UPDATE tda_piskvorky SET name = name || ' vs unnamedPlayer' WHERE name NOT LIKE '%vs%'");
  db.close();
});


//get požadavek na všechny hry
router.get("/v1/games", (req, res) => {
  const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
  db.all("SELECT * FROM tda_piskvorky", [], (err, rows) => {
    if (err) {
      console.error("Chyba při dotazu do databáze:", err.message); // Zobraz chybovou zprávu
      res.status(500).json({ error: "Došlo k chybě při načítání dat." });

    } else {
      try {
        const parsedRows = rows.map(row => {
          let parsedBoard;
          try {
            parsedBoard = JSON.parse(row.board);
          } catch (e) {
            parsedBoard = row.board;
          }
          return {
              ...row,
              board: parsedBoard
          };
        });
        res.status(200).json(parsedRows);
      } catch (error) {
        console.error("Error parsing board field:", error.message);
        res.status(500).json({ error: "Error parsing board field." });
      
      }
    }
  })
  db.close();
});

//get požadavek na konkrétní hr
router.get("/v1/games/:uuid", (req, res) => {
  const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
  const { uuid } = req.params;

  db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [uuid], (err, game) => {
    if (err) {
      console.error("Chyba při dotazu do databáze:", err.message);
      res.status(500).json({ error: "při načítání dat došlo k chybě" });
     
    } else {
      if (!game) {
        res.status(404).json({ "code": 404, "message": "source not found" })
        
      } else {
        // Pokud byla hra nalezena, renderuj konkrétní hru
        res.status(200).json({
          "uuid": game.uuid,
          "createdAt": game.createdAt,
          "updatedAt": game.updatedAt,
          "name": game.name,
          "difficulty": game.difficulty,
          "gameState": game.gameState,
          "board": JSON.parse(game.board)
        });
      
        //to tady bejt už dávno nemělo
      }
    }
  })
  db.close();
});

//delete pro konkrétní hru

router.delete("/v1/games/:uuid", (req, res) => {
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

router.put("/v1/games/:uuid", (req, res) => {
  const { uuid } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))

  if (!uuid) {
    res.status(400).json({ "code": 400, "message": "Bad Request" });
 
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
      }
      if (!difficulty) {
        difficulty = data.difficulty
      }
      if (!board) {
        board = data.board
      }
    }

   const boardStr = JSON.stringify(board)
    const createdAt = data.createdAt
    db.run("UPDATE tda_piskvorky SET name = ?, difficulty = ?, board = ?, updatedAt = ? WHERE uuid = ?", [name, difficulty, boardStr, updatedAt, uuid], (err) => {
      if (err) {
        console.error("GG, něco se dosralo. Nepodařilo se aktualizovat záznam v databázi. " + err.message)
        res.status(500).json({ message: "GG, něco se dosralo. Nepodařilo se aktualizovat záznam v databázi. " + err.message });
      
      } else {

        res.status(200).json({
          "uuid": uuid,
          "createdAt": createdAt,
          "updatedAt": updatedAt,
          "name": name,
          "difficulty": difficulty,
          "gameState": data.gameState,
          "board": board
        })
        console.log("ok");
       
      }
    }

    )
  })
  db.close();






})


/* ******************************************** */


/* ********************** USERS ********************** */



router.post("/v1/users",async (req, res)=>{








 const {username, password, email, elo} = req.body;
 const newUserId = uuid.v4();
 const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
//hashování hesla... nic o tom neříkali ale dává mi smysl že by to tu mělo být
 const cryptedPassword = await bcrypt.hash(password, 10);
 const banned = 0;

 console.log("do databáze ukládám ", cryptedPassword);

 db.run("INSERT INTO users(uuid, username, password, email, elo, banned) VALUES(?,?,?,?,?,?)",[newUserId, username, cryptedPassword, email, elo, banned], 
  function(error){
    if(error){
      res.status(500).json({
        code:500,
        message: "Došlo k chybě při vytváření záznamu" + error
      })

    }else{
      db.get("SELECT * FROM users WHERE uuid = ?",[newUserId],(err, rows)=>{
        if(err){
          res.status(500).json({
            code:500,
            message: "získávání vytvořeného záznamu" + err
          })
        }else{
          res.status(201).json({
            "uuid": rows.uuid,
            "createdAt": rows.createdAt,
            "username": rows.username,
            "email":rows.email,
            "elo": rows.elo,
            "wins":rows.wins,
            "draws": rows.draws,
            "losses":rows.losses
          })
        }
      })
    }
  }
 )
 db.close();


})

router.get("/v1/users", (req, res)=>{
  const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
  db.all("SELECT uuid, createdAt, username, email, elo, wins, draws, losses FROM users",[],(err, rows)=>{
  if(err){
    console.log("Chyba v GET požadavku"+err)
    res.status(500).json({
      code: 500,
      message: "Nepovedlo se dostat data z databáze"
    })
  }else{
    res.status(200).json(rows)
    
  }
  })
  db.close();
})








module.exports = router;
