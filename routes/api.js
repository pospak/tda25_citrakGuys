var express = require("express")
var router = express.Router();
var sqlite3 = require("sqlite3")
var path = require("path")
const {getGameState} = require("./gameStateChecker");




const uuid = require("uuid");
const { title, send } = require("process");
const { ifError } = require("assert");
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("cs-CZ"); // Formátuje datum do formátu DD.MM.RRRR
  const formattedTime = date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }); // Pouze hodiny a minuty
  return `${formattedDate} ${formattedTime}`;
};
const { sendLogToDiscord } = require("./errorSpotter")

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
  sendLogToDiscord(board)
  // Validace obsahu a rozměrů
  const isValidBoard = isCorrectSize && board.every(row =>
    row.every(cell => allowedSymbols.includes(cell))
  );
  if (!board) board = Array.from({ length: 15 }, () => Array(15).fill(""))
  gameState = getGameState(board); // Určení stavu hry

  if (gameState === "invalid" || !isValidBoard ) {
    sendLogToDiscord(
    "post zkapal protože byla zachcena sematická chyba."
    )
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
        sendLogToDiscord("post zkapal protože " + err)
      } else {
        sendLogToDiscord(
        res.status(201).json({
          "uuid": newGameId,
          "createdAt": createdAt,
          "updatedAt": updatedAt,
          "name": name,
          "difficulty": difficulty,
          "gameState": gameState,
          "board": board // Vrať ID nového záznamu
        }))
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
      sendLogToDiscord("get na všechny hry zkapal protože " + err.message)
    } else {
      sendLogToDiscord("proběhl get na všechny hry")
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
        sendLogToDiscord("Error parsing board field: " + error.message);
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
      sendLogToDiscord("get na konkrétní hru zkapal, protože " + err.message)
    } else {
      if (!game) {
        res.status(404).json({ "code": 404, "message": "source not found" })
        sendLogToDiscord("pokus o získání konkrétní hry podle UUID zkapal. Hra s požadovaným id nebyla nalezena")
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
        sendLogToDiscord("proběhl get na konkrétní hru")
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
      sendLogToDiscord("smazání hry zkapalo protože " + err.message)
    } else {
      res.status(204).json({ message: "Hra úspěšně smazána" });;
      console.log("ok")
      sendLogToDiscord("delete proběhlo")
    }
  })
  db.close();
})

router.put("/v1/games/:uuid", (req, res) => {
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
      sendLogToDiscord("toto nemá error ale zabilo se to tu :D (put)")
    } else if (!data) {
      res.status(404).json({ "code": 404, "message": "Resource not found" })
      console.error("kokote posrals to!")
      sendLogToDiscord("záznam podle uuid nebyl nalezen (put)")

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
        sendLogToDiscord("put zkapal protože " + err.message)
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
        sendLogToDiscord("put proběhl")
      }
    }

    )
  })
  db.close();






})




// Zkontrolujeme, jestli je JSON pole





module.exports = router;
