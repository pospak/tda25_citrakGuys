
var sqlite3 = require("sqlite3")
var path = require("path")
const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("cs-CZ"); // Formátuje datum do formátu DD.MM.RRRR
    const formattedTime = date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' }); // Pouze hodiny a minuty
    return `${formattedDate} ${formattedTime}`;
  };
  

function all(){
  router.get("/", (req, res) => {
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
}  



function byUUID(uuid){
  router.get("/:uuid", (req, res) => {
    db.get("SELECT * FROM tda_piskvorky WHERE uuid = ?", [uuid], (err, game) => {
      if (err) {
        console.error("Chyba při dotazu do databáze:", err.message);
     
      } else {
        if (!game) {
          // Pokud hra nebyla nalezena, renderuj všechny hry
          db.all("SELECT * FROM tda_piskvorky", [], (err, rows) => {
            if (err) {
              console.error("Chyba při dotazu do databáze:", err.message);
             
            } else {
                    res.render("games",{
                      title: "Uložené hry",
                      games: rows,
                      board: board,
                      formatDate
                    })
            }
          });
        } else {
          // Pokud byla hra nalezena, renderuj konkrétní hru
         
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
}



module.exports = {all};
module.exports =  {byUUID};