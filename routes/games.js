var express = require("express")
var router = express.Router();
var sqlite3 = require("sqlite3")
var path = require("path")
const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
const uuid = require("uuid");



//post požadavek na vytvoření nové hry
router.post("/", (req, res) => {
    const newGameId = uuid.v4();
    const { game_name, game_state, difficulty } = req.body;
    const created_at = new Date().toISOString();
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
        "INSERT INTO tda_piskvorky(uuid, game_name, created_at, game_state, board, difficulty) VALUES (?, ?, ?, ?, ?,?)",
        [newGameId,game_name, created_at, game_state, board, difficulty],
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
router.get("/", (req, res)=>{

    db.run(
        "SELECT * FROM tda_piskvorky",
        function (err) {
            if (err) {
                res.status(500).json({
                    error: "Došlo k chybě při vytváření záznamu"+err,
                });
            } else {
                res.status(201).json({
                    message: "Záznam vytvořen",
                    id: this.lastUUID, // Vrať ID nového záznamu
                });
            }
        }
    );


})

module.exports = router;
