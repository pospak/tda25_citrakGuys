
var args = document.getElementById("form");
 args.style.display = "none";
function inputArgs(){
   args.style.display = "inline-block";
}

function newGame(){
    var gameName1 = document.arg.name1.value
    var gameName2 = document.arg.name2.value
    var diffi = Number(document.arg.diffic.value)
    var gameName = gameName1 + " vs " + gameName2
    if(!gameName || gameName == " vs "){
        gameName = "Hráč 1 vs Hráč 2"
    }
    let diff
    switch(diffi){
        case 1:
            diff = "beginner"
            break;
        case 2:
            diff = "easy"
            break;
        case 3:
            diff = "medium"
            break;
        case 4:
            diff = "hard"
            break;
        case 5:
            diff = "extreme"
            break;
    }
   
    fetch("/game", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name: gameName,
            difficulty: diff
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("něco se dosralo, nepodařilo se přijmout odpověď od api"); 
        }
        return response.json(); // Vrátí JSON data pro další zpracování
    })
    .then(data => {
        console.log(data); 
        var uuid = data.uuid;
        // Ověříme, jestli uuid existuje, a poté přesměrujeme
        if (uuid) {
            window.location.href = "/game/" + uuid;
        } else {
            console.error("ID hry nebylo nalezeno v odpovědi.");
        }
    })
    .catch(error => console.error("Error: "+error))
   

}


function deleteGame(uuid){
    fetch(`/api/v1/games/${uuid}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log("Záznam úspěšně smazán.");
            // Zde můžeš například aktualizovat DOM nebo přesměrovat uživatele
        location.reload();
        } else {
            console.error("Nepodařilo se smazat záznam.");
        }
    })
    .catch(error => console.error("Chyba: ", error));
}