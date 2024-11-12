var express = require("express")
var router = express.Router();
var sqlite3 = require("sqlite3")
var path = require("path")
const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
const uuid = require("uuid");
const { title } = require("process");
const { ifError } = require("assert");
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("cs-CZ"); // Formátuje datum do formátu DD.MM.RRRR
  const formattedTime = date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }); // Pouze hodiny a minuty
  return `${formattedDate} ${formattedTime}`;
};




//post požadavek na vytvoření nové hry
router.post("/v1/games", (req, res) => {
    const newGameId = uuid.v4();
    const { name,difficulty } = req.body;
    var {board} = req.body
    if (!name) {
      console.error("něco se dosralo, game_name nebylo přijato")
      return res.status(400).json({ error: "něco se dosralo, game_name nebylo přijato" });
  }else{
    console.log("Game_name přijato" + name);
  }

  if (!difficulty) {
    console.error("něco se dosralo, difficulty nebylo přijato")
      return res.status(400).json({ error: "něco se dosralo, difficulty nebylo přijato" });
  }else{
    console.log("Tady chyba nebude, difficulty přislo")
  }
    const gameState = "opening";
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    if(!board){
      board = [
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ]
      ]
    }
   

   const boardStr = JSON.stringify(board);

    db.run(
        "INSERT INTO tda_piskvorky(uuid, name, createdAt, gameState, board, difficulty, updatedAt) VALUES (?, ?, ?, ?, ?,?,?)",
        [newGameId,name, createdAt, gameState, boardStr, difficulty, updatedAt],
        function (err) {
            if (err) {
                res.status(500).json({
                    error: "Došlo k chybě při vytváření záznamu"+err,
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
                });
            }
        }
    );
});


//get požadavek na všechny hry
router.get("/v1/games", (req, res) => {
  const board = [
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ]
  ]

    db.all("SELECT * FROM tda_piskvorky", [], (err, rows) => {
        if (err) {
          console.error("Chyba při dotazu do databáze:", err.message); // Zobraz chybovou zprávu
          res.status(500).json({ error: "Došlo k chybě při načítání dat." });
        } else {
          const parsedRows = rows.map(row => {
            return {
                ...row,
                data: JSON.parse(row.board) // parsuj sloupec `data`
            };
        });
        res.status(200).json(parsedRows);      
        }
    });
});

//get požadavek na konkrétní hru
router.get("/v1/games/:uuid", (req, res) => {
  const { uuid } = req.params;
  db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [uuid], (err, game) => {
    if (err) {
      console.error("Chyba při dotazu do databáze:", err.message);
      res.status(500).json({ error: "při načítání dat došlo k chybě" });
    } else {
      if (!game) {
        // Pokud hra nebyla nalezena, renderuj všechny hry
        db.all("SELECT * FROM tda_piskvorky", [], (err, rows) => {
          if (err) {
            console.error("Chyba při dotazu do databáze:", err.message);
            res.status(500).json({ error: "Došlo k chybě při načítání dat." });
          } else {
             res.status(200).json(parsedRows);     
          }
        });
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
        res.render("game", {
          title: game.name,
          data: game,
          board: JSON.parse(game.board),
          formatDate,
        });
     
      }
    }
  });
});

//delete pro konkrétní hru

router.delete("/v1/games/:uuid", (req, res)=>{
  const {uuid} = req.params;
  db.run("DELETE FROM tda_piskvorky WHERE uuid=?", [uuid], (err)=>{
    if(err){
      console.error("Smazání hry neproběhlo! "+err.message);
      res.status(500).json({error: err.message})
    }else{
      res.status(204).json({ message: "Hra úspěšně smazána" });;
      console.log("ok")
    }
  })
})


module.exports = router;
