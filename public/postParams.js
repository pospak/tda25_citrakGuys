var args = document.getElementById("form");
 args.style.display = "none";
function inputArgs(){
   args.style.display = "inline-block";
}

function editName(){
   // Najdi element H1, který chceš nahradit
    const h1Element = document.getElementById("title")
    const newText = h1Element.textContent.split(" vs ");
// Vytvoř nový input element
    

    const inputElement1 = document.createElement('input');
    inputElement1.type = 'text';
    inputElement1.value = newText[0];
    inputElement1.id = "name1";

    const inputElement2 = document.createElement('input');
    inputElement2.type = 'text';
    inputElement2.value = newText[1];
    inputElement2.id = "name2"
    const p = document.createElement("p");
    p.textContent = " vs "

    const save = document.createElement("button");
    save.type = "button"
    save.textContent = "Uložit"
    save.id = "save"
    
    const storno = document.createElement("button");
    storno.type = "button"
    storno.textContent = "Storno"
    storno.id = "storno"

    const br = document.createElement("br") 

    const Div = document.createElement("div");
    Div.append(inputElement1, p, inputElement2,br, save, storno)
// Nahrazení H1 za input

h1Element.parentNode.replaceChild(Div, h1Element);

var stornoBtn = document.getElementById("storno");
stornoBtn.addEventListener("click", function(){
    window.location.reload();
})


var saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", function(){
    var input1 = document.getElementById("name1");
    var input2 = document.getElementById("name2");
    var uuid = document.getElementById("uuid").textContent;
    var name = input1.value + " vs " + input2.value;
    fetch(`/game/${uuid}`, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name: name
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
        window.location.reload();
    })
    .catch(error => console.error("Error: "+error))

    
})

}


function editDiff(){

    var oldDiffy = document.getElementById("diffi").dataset.diff;
    const diff = document.getElementById("diffi");
   

    switch(oldDiffy){
        case "beginner":
            const select = document.createElement("select");
            select.id = "diffy";

            const option0  = document.createElement("option");
            option0.textContent = "Začátečník"
            
            const option1 = document.createElement("option");
            option1.value = "easy";
            option1.textContent = "Snadná";
            
            const option2 = document.createElement("option");
            option2.value = "medium";
            option2.textContent = "Střední";
            
            const option3 = document.createElement("option");
            option3.value = "hard";
            option3.textContent = "Těžká";
            
            const option4 = document.createElement("option");
            option4.value = "extreme";
            option4.textContent = "Extrémně těžká";
            
            select.appendChild(option0);
            select.appendChild(option1);
            select.appendChild(option2);
            select.appendChild(option3);
            select.appendChild(option4);

            diff.parentNode.replaceChild(select, diff);
        break;
        case "easy":
            const select1 = document.createElement("select");
            select1.id = "diffy";

            const option01  = document.createElement("option");
            option0.textContent = "Snadná"
            
            const option11 = document.createElement("option");
            option1.value = "medium";
            option1.textContent = "Střední";
            
            const option21 = document.createElement("option");
            option2.value = "hard";
            option2.textContent = "Těžká";
            
            const option31 = document.createElement("option");
            option3.value = "extreme";
            option3.textContent = "Extrémně těžká";
            
            const option41 = document.createElement("option");
            option4.value = "beginner";
            option4.textContent = "Začátečník";
            
            select1.appendChild(option01);
            select1.appendChild(option11);
            select1.appendChild(option21);
            select1.appendChild(option31);
            select1.appendChild(option41);

            diff.parentNode.replaceChild(select1, diff);
        break;
        case "medium":
            const select2 = document.createElement("select");
            select2.id = "diffy";

            const option02  = document.createElement("option");
            option0.textContent = "Střední"
            
            const option12 = document.createElement("option");
            option1.value = "hard";
            option1.textContent = "Těžká";
            
            const option22 = document.createElement("option");
            option2.value = "extreme";
            option2.textContent = "Extrémně těžká";
            
            const option32 = document.createElement("option");
            option3.value = "beginner";
            option3.textContent = "Začátečník";
            
            const option42 = document.createElement("option");
            option4.value = "easy";
            option4.textContent = "Snadná";
            
            select2.appendChild(option02);
            select2.appendChild(option12);
            select2.appendChild(option22);
            select2.appendChild(option32);
            select2.appendChild(option42);

            diff.parentNode.replaceChild(select2, diff);
        break;
        case "hard":
            const select3 = document.createElement("select");
            select2.id = "diffy";

            const option03  = document.createElement("option");
            option0.textContent = "Těžká"
            
            const option13 = document.createElement("option");
            option1.value = "extreme";
            option1.textContent = "Extrémně těžká";
            
            const option23 = document.createElement("option");
            option2.value = "beginner";
            option2.textContent = "Začátečník";
            
            const option33 = document.createElement("option");
            option3.value = "easy";
            option3.textContent = "Snadná";
            
            const option43 = document.createElement("option");
            option4.value = "medium";
            option4.textContent = "Střední";
            
            select3.appendChild(option03);
            select3.appendChild(option13);
            select3.appendChild(option23);
            select3.appendChild(option33);
            select3.appendChild(option43);

            diff.parentNode.replaceChild(select3, diff);
        break;
        case "beginner":
            const select4 = document.createElement("select");
            select4.id = "diffy";

            const option04  = document.createElement("option");
            option0.textContent = "Extrémně těžká"
            
            const option14 = document.createElement("option");
            option1.value = "beginner";
            option1.textContent = "Začátečník";
            
            const option24 = document.createElement("option");
            option2.value = "easy";
            option2.textContent = "Snadná";
            
            const option34 = document.createElement("option");
            option3.value = "medium";
            option3.textContent = "Střední";
            
            const option44 = document.createElement("option");
            option4.value = "hard";
            option4.textContent = "Těžká";
            
            select4.appendChild(option04);
            select4.appendChild(option14);
            select4.appendChild(option24);
            select4.appendChild(option34);
            select4.appendChild(option44);

            diff.parentNode.replaceChild(select4, diff);
        break;
    }

    

document.getElementById("diffy").addEventListener("change",function(){
    var uuid = document.getElementById("uuid").textContent;
    var diff = document.getElementById("diffy").value;
     fetch(`/game/${uuid}`, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
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
        window.location.reload();
    })
    .catch(error => console.error("Error: "+error))   
})

   





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
    fetch(`/game`, {
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

function updateInfo(){

}