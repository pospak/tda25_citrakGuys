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
    const { game_name,difficulty } = req.body;
    if (!game_name) {
      console.error("něco se dosralo, game_name nebylo přijato")
      return res.status(400).json({ error: "něco se dosralo, game_name nebylo přijato" });
  }else{
    console.log("Game_name přijato" + game_name);
  }

  if (!difficulty) {
    console.error("něco se dosralo, difficulty nebylo přijato")
      return res.status(400).json({ error: "něco se dosralo, difficulty nebylo přijato" });
  }else{
    console.log("Tady chyba nebude, difficulty přislo")
  }
    const game_state = "opening";
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
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

   const boardStr = JSON.stringify(board);

    db.run(
        "INSERT INTO tda_piskvorky(uuid, game_name, created_at, game_state, board, difficulty, updated_at) VALUES (?, ?, ?, ?, ?,?,?)",
        [newGameId,game_name, created_at, game_state, boardStr, difficulty, updated_at],
        function (err) {
            if (err) {
                res.status(500).json({
                    error: "Došlo k chybě při vytváření záznamu"+err,
                });
            } else {
                res.status(201).json({
                    message: "Záznam vytvořen",
                    id: newGameId, // Vrať ID nového záznamu
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
            res.status(200);
            res.render("games",{
              title: "Uložené hry",
              games: rows,
              board: board,
              formatDate
            })
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
      res.status(200);
      if (!game) {
        // Pokud hra nebyla nalezena, renderuj všechny hry
        db.all("SELECT * FROM tda_piskvorky", [], (err, rows) => {
          if (err) {
            console.error("Chyba při dotazu do databáze:", err.message);
            res.status(500).json({ error: "Došlo k chybě při načítání dat." });
          } else {
            res.status(200);
            res.render("games", {
              title: "Uložené hry",
              games: rows,
              formatDate,
            });
          }
        });
      } else {
        // Pokud byla hra nalezena, renderuj konkrétní hru
        res.render("game", {
          title: game.game_name,
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