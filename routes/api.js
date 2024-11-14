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
  const isArray = Array.isArray(req.body);
  const games = isArray ? req.body : [req.body]; // Zabalíme jeden objekt do pole, pokud `req.body` není pole

  // Proměnné pro sledování chyb a úspěšných vložení
  const errors = [];
  const successfulInserts = [];

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    games.forEach((game) => {
      const uuidId = uuid.v4();
      const {
        name,
        difficulty,
        board = Array.from({ length: 15 }, () => Array(15).fill("")), // Defaultní prázdná hrací plocha 15x15
        createdAt = new Date().toISOString(),
        updatedAt = new Date().toISOString(),
      } = game;

      // Zkontrolujeme, zda chybí klíčové hodnoty
      if (!name || !difficulty) {
        errors.push({ uuid: uuidId, message: "Missing required fields: name or difficulty" });
        return;
      }

      const boardStr = JSON.stringify(board);

      db.run(
        "INSERT INTO tda_piskvorky(uuid, name, createdAt, gameState, board, difficulty, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [uuidId, name, createdAt, "opening", boardStr, difficulty, updatedAt],
        function (err) {
          if (err) {
            errors.push({ uuid: uuidId, message: err.message });
          } else {
            successfulInserts.push({
              uuid: uuidId,
              name,
              createdAt,
              updatedAt,
              difficulty,
              gameState: "opening",
              board,
            });
          }
        }
      );
    });

    db.run("COMMIT", () => {
      if (errors.length > 0) {
        res.status(207).json({
          message: "Some records could not be inserted",
          errors,
          successfulInserts,
        });
      } else {
        res.status(201).json({
          message: "All records inserted successfully",
          successfulInserts,
        });
      }
    });
  });
});




//get požadavek na všechny hry
router.get("/v1/games", (req, res) => {
    db.all("SELECT * FROM tda_piskvorky", [], (err, rows) => {
        if (err) {
          console.error("Chyba při dotazu do databáze:", err.message); // Zobraz chybovou zprávu
          res.status(500).json({ error: "Došlo k chybě při načítání dat." });
        } else {
          const parsedRows = rows.map(row => {
            return {
                ...row,
                board: JSON.parse(row.board) // parsuj sloupec `data`
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

router.put("/v1/games/:uuid", (req, res)=>{
  const {uuid} = req.params;
  if(!uuid){
    res.status(400).json({"code": 400, "message":"Bad Request"});
    console.error("kokote posrals to!")
  }
  var {name, difficulty, board} = req.body
  const updatedAt = new Date().toISOString();
  db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [uuid], (err, data)=>{
    if(err){
      console.error("pico posrals to! xD "+err.message)
    }
    if(!data){
      res.status(404).json({"code":404,"message":"Rescue not found"})
      console.error("kokote posrals to!")
    }else{
       if(!name){
      name = data.name
    }
    if(!difficulty){
      difficulty = data.difficulty
    }
    if(!board){
      board = data.board
    } 
    }
   
    const createdAt = data.createdAt
    db.run("UPDATE tda_piskvorky SET name = ?, difficulty = ?, board = ?, updatedAt = ? WHERE uuid = ?", [name, difficulty, board, updatedAt, uuid], (err)=>{
    if(err){
      console.error("GG, něco se dosralo. Nepodařilo se aktualizovat záznam v databázi. "+ err.message)
      res.status(500).json({message: "GG, něco se dosralo. Nepodařilo se aktualizovat záznam v databázi. " + err.message});
    }else{
       
        res.status(200).json({
         "uuid": uuid,
         "createdAt": createdAt,
          "updatedAt": updatedAt,
          "name": name,
          "difficulty": difficulty,
          "gameState": data.gameState,
          "board": JSON.parse(board)
        }) 
        console.log("ok");
    }
  }

  )
  })
  
 
 



})




  // Zkontrolujeme, jestli je JSON pole
  




module.exports = router;
