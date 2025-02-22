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

    var oldDiffy = document.getElementById("diffi").dataset.diffyyyyy;
    const diff = document.getElementById("diffi");

   

    switch(oldDiffy){
        case "beginner": {
            const selectBeginner = document.createElement("select");
            selectBeginner.id = "diffy";

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
            
            selectBeginner.appendChild(option0);
            selectBeginner.appendChild(option1);
            selectBeginner.appendChild(option2);
            selectBeginner.appendChild(option3);
            selectBeginner.appendChild(option4);

            diff.parentNode.replaceChild(selectBeginner, diff);
        break;
        }
           case "easy":{
            const selectEasy = document.createElement("select");
            selectEasy.id = "diffy";

            const option0  = document.createElement("option");
            option0.textContent = "Snadná"
            
            const option1 = document.createElement("option");
            option1.value = "medium";
            option1.textContent = "Střední";
            
            const option2 = document.createElement("option");
            option2.value = "hard";
            option2.textContent = "Těžká";
            
            const option3 = document.createElement("option");
            option3.value = "extreme";
            option3.textContent = "Extrémně těžká";
            
            const option4 = document.createElement("option");
            option4.value = "beginner";
            option4.textContent = "Začátečník";
            
            selectEasy.appendChild(option0);
            selectEasy.appendChild(option1);
            selectEasy.appendChild(option2);
            selectEasy.appendChild(option3);
            selectEasy.appendChild(option4);

            diff.parentNode.replaceChild(selectEasy, diff);
        break;
           }
           
        case "medium": {
            const selectMedium = document.createElement("select");
            selectMedium.id = "diffy";

            const option0  = document.createElement("option");
            option0.textContent = "Střední"
            
            const option1 = document.createElement("option");
            option1.value = "hard";
            option1.textContent = "Těžká";
            
            const option2 = document.createElement("option");
            option2.value = "extreme";
            option2.textContent = "Extrémně těžká";
            
            const option3 = document.createElement("option");
            option3.value = "beginner";
            option3.textContent = "Začátečník";
            
            const option4 = document.createElement("option");
            option4.value = "easy";
            option4.textContent = "Snadná";
            
            selectMedium.appendChild(option0);
            selectMedium.appendChild(option1);
            selectMedium.appendChild(option2);
            selectMedium.appendChild(option3);
            selectMedium.appendChild(option4);

            diff.parentNode.replaceChild(selectMedium, diff);
        break;
        }
           
        case "hard": {
            const selectHard = document.createElement("select");
            selectHard.id = "diffy";

            const option0  = document.createElement("option");
            option0.textContent = "Těžká"
            
            const option1 = document.createElement("option");
            option1.value = "extreme";
            option1.textContent = "Extrémně těžká";
            
            const option2 = document.createElement("option");
            option2.value = "beginner";
            option2.textContent = "Začátečník";
            
            const option3 = document.createElement("option");
            option3.value = "easy";
            option3.textContent = "Snadná";
            
            const option4 = document.createElement("option");
            option4.value = "medium";
            option4.textContent = "Střední";
            
            selectHard.appendChild(option0);
            selectHard.appendChild(option1);
            selectHard.appendChild(option2);
            selectHard.appendChild(option3);
            selectHard.appendChild(option4);
            diff.parentNode.replaceChild(selectHard, diff);
        break;
        }
           
        case "extreme":{
            const selectExtreme = document.createElement("select");
            selectExtreme.id = "diffy";

            const option0  = document.createElement("option");
            option0.textContent = "Extrémně těžká"
            
            const option1 = document.createElement("option");
            option1.value = "beginner";
            option1.textContent = "Začátečník";
            
            const option2 = document.createElement("option");
            option2.value = "easy";
            option2.textContent = "Snadná";
            
            const option3 = document.createElement("option");
            option3.value = "medium";
            option3.textContent = "Střední";
            
            const option4 = document.createElement("option");
            option4.value = "hard";
            option4.textContent = "Těžká";
            
            selectExtreme.appendChild(option0);
            selectExtreme.appendChild(option1);
            selectExtreme.appendChild(option2);
            selectExtreme.appendChild(option3);
            selectExtreme.appendChild(option4);

            diff.parentNode.replaceChild(selectExtreme, diff);
        break;
        }
            
    }

    

document.getElementById("edit").addEventListener("click",function(){
    window.location.reload();
})


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


function deleteGame(){
    const uuid = document.getElementById("uuid").textContent;
    fetch(`/game/${uuid}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log("Záznam úspěšně smazán.");
            // Zde můžeš například aktualizovat DOM nebo přesměrovat uživatele
        window.location.href = "/game"
        } else {
            console.error("Nepodařilo se smazat záznam.");
        }
    })
    .catch(error => console.error("Chyba: ", error));
}


   // Získání elementů
 // Funkce pro otevírání modalu
 function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex'; // Zobrazí modal
    }
  }
  
  // Funkce pro zavírání modalu
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none'; // Skryje modal
    }
  }
  
  // Přidání event listenerů na všechny knihy a zavírací tlačítka
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
      const modalId = card.id.replace('book', ''); // Např. 'book4' -> '4'
      openModal(modalId);
    });
  });
  
  document.querySelectorAll('.close-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const modalId = e.target.id.replace('closeModal', ''); // Např. 'closeModal4' -> '4'
      closeModal(modalId);
    });
  });
  
  // Zavření modalu při kliknutí mimo obsah
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none'; // Skryje modal
    }
  });


  function newFreePlay(){
    fetch("/play/friend", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Operace úspěšně selhala"); 
        }
        return response.json(); // Vrátí JSON data pro další zpracování
    })
    .then(data => {
        console.log(data); 
        var uuid = data.uuid;
        // Ověříme, jestli uuid existuje, a poté přesměrujeme
        if (uuid) {
            window.location.href = `/play/friend/${uuid}`;
        } else {
            console.error("ID hry nebylo nalezeno v odpovědi.");
        }
    })
    .catch(error => console.error("Error: "+error))
  }