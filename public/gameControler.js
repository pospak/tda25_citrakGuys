// Najdeme element #gameBoard
const boardElement = document.getElementById("gameBoard");

const size = 15; // Velikost hrací plochy
let gameActive = true;

// Funkce, která určí, kdo je na tahu
// Funkce, která určí, kdo je na tahu
function playerTurn() {
    let xCount = 0;
    let oCount = 0;

    const cells = boardElement.querySelectorAll(".cell");
    cells.forEach(cell => {
        if (cell.innerHTML === "X") xCount++;
        if (cell.innerHTML === "O") oCount++;
    });

    // Pokud je počet tahů X a O stejný, na tahu je "X", jinak "O"
    return xCount === oCount ? "X" : "O";
}

// Funkce pro provedení tahu
function makeMove(cell) {
    if (cell.innerHTML === "" && gameActive) { // Kontrola, zda je buňka prázdná
        const currentPlayer = playerTurn();
        cell.innerHTML = currentPlayer; // Přidáme text "X" nebo "O" do buňky

        // Kontrola, zda tah není vítězný
        if (checkWinningMove(currentPlayer)) {
            announceWinner(currentPlayer); // Oznámíme vítěze
        }
    }
}

// Kontrola vítězného tahu
function checkWinningMove(player) {
    const cells = Array.from(boardElement.querySelectorAll(".cell"));
    const grid = [];
    while (cells.length) grid.push(cells.splice(0, size));

    // Kontrola řádků
    for (let row of grid) {
        if (checkLine(row, player)) return true;
    }

    // Kontrola sloupců
    for (let col = 0; col < size; col++) {
        const column = grid.map(row => row[col]);
        if (checkLine(column, player)) return true;
    }

    // Kontrola hlavní diagonály (zleva doprava)
    for (let row = 0; row <= size - 5; row++) {
        for (let col = 0; col <= size - 5; col++) {
            if (checkDiagonal(grid, row, col, player, 1, 1)) return true;
        }
    }

    // Kontrola vedlejší diagonály (zprava doleva)
    for (let row = 0; row <= size - 5; row++) {
        for (let col = 4; col < size; col++) {
            if (checkDiagonal(grid, row, col, player, 1, -1)) return true;
        }
    }

    return false;
}

// Pomocná funkce pro kontrolu řady/sloupce
function checkLine(line, player) {
    let count = 0;
    for (let cell of line) {
        if (cell.innerHTML === player) {
            count++;
            if (count === 5) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

// Pomocná funkce pro kontrolu diagonál
function checkDiagonal(grid, startRow, startCol, player, rowInc, colInc) {
    let count = 0;
    for (let i = 0; i < 5; i++) {
        const row = startRow + i * rowInc;
        const col = startCol + i * colInc;
        if (grid[row][col].innerHTML === player) {
            count++;
            if (count === 5) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

// Vyhlášení vítěze
function announceWinner(winner) {
    alert(`${winner} vyhrál!`);
    gameActive = false;
}



function saveGame(){
    const uuid = document.getElementById("uuid");
    const board = Array.from(boardElement.querySelectorAll(".cell")).map(cell => cell.textContent.trim());

    fetch(`/game/${uuid.textContent}`, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            board: board
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("něco se dosralo, nepodařilo se přijmout odpověď od api"); 
        }else{
            location.reload(); //přenačte stránku s aktuálníma datama... nebo mělo by (jestli ne, tak je někde chyba)
        }
      
    })
    .then(console.log(board))
    .catch(error => console.error("Error: "+error)) 
    console.log(board);
    alert("podívej se do logů")

}

boardElement.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell"); // Najdi nejbližší .cell

    if (cell) { // Pokud existuje .cell
        console.log("Kliknutí na buňku:", cell);

        makeMove(event.target); // Předáme buňku do makeMove() pro práci
        console.log("makeMove() byla spuštěna");

        saveGame();
        console.log("saveGame() byla spuštěna");
    }
});




function deleteGame(uuid) {
   event.preventDefault();
   // Po úspěšném smazání přesměruj na /games
   
    fetch(`/api/v1/games/${uuid}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        console.log("ok");
        setTimeout(() => {
            window.location.replace("/games");
          }, 2000);
      } else {
        console.error("Nepodařilo se smazat hru.");
        window.location.href = "/error";
      }
    })
    .catch(error => console.error("Chyba: ", error));
  }
  

