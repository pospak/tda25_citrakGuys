
var args = document.getElementById("form");
 args.style.display = "none";
function inputArgs(){
   args.style.display = "inline-block";
}

function newGame(){
    var name = document.arg.name.value
    var diffi = Number(document.arg.diffic.value)

    if(!name){
        name = "Nová hra"
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
   
    fetch("/games", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            game_name: name,
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
        var uuid = data.id;
        // Ověříme, jestli uuid existuje, a poté přesměrujeme
        if (uuid) {
            window.location.href = "/games/" + uuid;
        } else {
            console.error("ID hry nebylo nalezeno v odpovědi.");
        }
    })
    .catch(error => console.error("Error: "+error))
   

}
