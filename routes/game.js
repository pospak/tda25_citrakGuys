var express = require("express")
var router = express.Router();
var sqlite3 = require("sqlite3")
var path = require("path")
const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("cs-CZ"); // Formátuje datum do formátu DD.MM.RRRR
    const formattedTime = date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }); // Pouze hodiny a minuty
    return `${formattedDate} ${formattedTime}`;
  };
  
router.get("/", (req, res) => {
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
router.get("/:uuid", (req, res) => {
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
        res.status(200)
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


module.exports = router;