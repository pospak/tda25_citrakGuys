// Najdeme element #gameBoard
const boardElement = document.getElementById("gameBoard");

const size = 15; // Velikost hrací plochy
let gameActive = true;

// Funkce, která určí, kdo je na tahu
function playerTurn() {
    let xCount = 0;
    let oCount = 0;

    const cells = boardElement.querySelectorAll(".cell");
    cells.forEach(cell => {
        if (cell.innerHTML.includes("X_cervene.png")) xCount++;
        if (cell.innerHTML.includes("O_modre.png")) oCount++;
    });
    return xCount === oCount 
        ? "<img src='/brand/TdA_Ikonky/PNG/X/X_cervene.png' alt='' width='10' height='10'>" 
        : "<img src='/brand/TdA_Ikonky/PNG/O/O_modre.png' alt='' width='10' height='10'>";
}

// Funkce pro provedení tahu
function makeMove(cell) {
    if (cell.innerHTML === "" && gameActive) { // Kontrola, zda je buňka prázdná
        const currentPlayer = playerTurn();
        cell.innerHTML = currentPlayer; // Přidáme ikonu hráče
        if (checkWinningMove(currentPlayer)) {
            announceWinner(currentPlayer.includes("X") ? "X" : "O");
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

// Přidáme event listener pro hrací plochu
boardElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) { // Pokud klikneme na buňku
        makeMove(event.target);
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
  

