var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")
var path  = require("path");
var uuid = require("uuid")
var bcrypt = require('bcrypt');
const { route } = require('./login');
const db = new sqlite3.Database(path.join(__dirname, '../data','data.sqlite'))
var session = require("express-session");

router.use(
  session({
    secret: "Td4p0kusyByC1tr4kGuys",  // Klíč pro podepisování cookies
    resave: false,         // Neuloží session, pokud se nezmění
    saveUninitialized: true, // Uloží novou session i bez změn
    cookie: { secure: false }, // Pokud bys měl HTTPS, dej true
  })
);



/* ********************** LOGIN ********************** */

router.get("/", (req, res)=>{
res.render("login",{
    title:"Přihlášení"
})
})
function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.get("SELECT username, password,uuid FROM users WHERE username = ?", [username], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

async function comparePasswords(inputPass, hashedPass) {
    return await bcrypt.compare(inputPass, hashedPass);
}
router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username); // ✅ Teď už db.get() funguje s async/await

        if (!user) {
            console.log("Uživatelské jméno nebylo nalezeno v databázi");
            return res.status(404).json({
                message: "Uživatelské jméno nebylo nalezeno v databázi. Prosím zkus to znovu!"
            });
        }

        const passFromDb = user.password;
        const isMatch = await comparePasswords(password, passFromDb); // ✅ Teď už můžeme použít await!

        if (!isMatch) {
            return res.status(401).json({
                message: "Špatně zadané heslo. Prosím zkus to znovu! PS: Pokud jsi zapomněl/a heslo, můžeš kliknout na tlačítko 'Zapomenuté heslo' pod tímto formulářem ;)"
            });
        }

        req.session.user = { id: 1, name: username };
        return res.status(200).json({ 
            message: "Ok", 
            user: req.session.user.name,
            uuid: user.uuid

         });

    } catch (error) {
        console.log("Chyba při dotazu do databáze nebo porovnání hesla:", error);
        return res.status(500).json({ message: "Interní chyba serveru." });
    }
});

/* ******************************************** */


/* ********************** SIGN UP ********************** */

router.get("/new",(req,res)=>{
res.render("register",{
        title: "Registrace"
    })
})





router.post("/new",async (req, res)=>{
 const {username, password, email} = req.body;
 const newUserId = uuid.v4();
 const db = new sqlite3.Database(path.join(__dirname, '../data', 'data.sqlite'))
 const banned = 0; //smazat až bude ověřování emailu ;)


//hashování hesla... nic o tom neříkali ale dává mi smysl že by to tu mělo být
 const cryptedPassword = await bcrypt.hash(password, 10);

 console.log("do databáze ukládám ", cryptedPassword);

 db.run("INSERT INTO users(uuid, username, password, email, banned) VALUES(?,?,?,?,?)",[newUserId, username, cryptedPassword, email, banned], 
  function(error){
    if(error){
      res.status(500).json({
        code:500,
        message: "Došlo k chybě při vytváření záznamu" + error
      })

    }else{
    res.status(201).json({
        message:"Ok"
    })
    }
  }
 )
 db.close();


})

/* ******************************************** */

/* ********************** LOGIN TO THE GAME ********************** */

router.get("/:uuid", (req, res)=>{
    const {uuid} = req.params;
    res.render("login",{
        title:"Přihlášení",
        uuid: uuid
    })
    })
    
    
    /* ******************************************** */


module.exports = router;