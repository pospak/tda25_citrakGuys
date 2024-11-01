

var args = document.getElementById("form");
 args.style.display = "none";
function inputArgs(){
   args.style.display = "inline-block";
}

function newGame(){
    var name = document.arg.name
    var diffi = document.arg.diff

    if(!name){
        name = "Nová hra"
    }

    switch(diffi){
        case 1:
            var diff = "beginner"
        case 2:
            var diff = "easy"
        case 3:
            var diff = "medium"
        case 4:
            var diff = "hard"
        case 5:
            var diff = "extreme"
    }
   
    fetch("/games", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            gmae_name: name,
            difficulty: diff
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error: "+error))
    window.location.href = "/games"

}

