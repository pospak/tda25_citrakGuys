var express = require("express")
var router = express.Router();
var sqlite3 = require("sqlite3")
var path = require("path")
const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
const uuid = require("uuid");
const { title } = require("process");
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("cs-CZ"); // Formátuje datum do formátu DD.MM.RRRR
  const formattedTime = date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }); // Pouze hodiny a minuty
  return `${formattedDate} ${formattedTime}`;
};




//post požadavek na vytvoření nové hry
router.post("/", (req, res) => {
    const newGameId = uuid.v4();
    const { game_name,difficulty } = req.body;
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
        "O",
        "O",
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
        "X",
        "O",
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
        "X",
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
        "X",
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

    db.run(
        "INSERT INTO tda_piskvorky(uuid, game_name, created_at, game_state, board, difficulty, updated_at) VALUES (?, ?, ?, ?, ?,?,?)",
        [newGameId,game_name, created_at, game_state, board, difficulty, updated_at],
        function (err) {
            if (err) {
                res.status(500).json({
                    error: "Došlo k chybě při vytváření záznamu"+err,
                });
            } else {
                res.status(201).json({
                    message: "Záznam vytvořen",
                    id: this.lastID, // Vrať ID nového záznamu
                });
            }
        }
    );
});


//get požadavek na všechny hry
router.get("/", (req, res) => {
    db.all("SELECT * FROM tda_piskvorky", [], (err, rows) => {
        if (err) {
          console.error("Chyba při dotazu do databáze:", err.message); // Zobraz chybovou zprávu
          res.status(500).json({ error: "Došlo k chybě při načítání dat." });
        } else {
            res.status(200);
            res.render("games",{
              title: "Uložené hry",
              games: rows,
              formatDate
            })
        }
    });
});

//get požadavek na konkrétní hru

router.get("/:uuid", (req, res)=>{
const {uuid} = req.params;
db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [uuid], (err, game)=>{
  if(err){
    console.error("Chyba při dotazu do databáze:", err.message)
    res.status(500).json({error: "při načítání dat došlo k chybě"})
  }else{
    res.status(200);
    res.render("game", {
      title : game.game_name,
      data: game,
      formatDate
    })
  }
}
  
  
  
  )

})


module.exports = router;
