// Najdeme element #gameBoard
const boardElement = document.getElementById("gameBoard");
const playerX = document.getElementById("playerX").textContent;
const playerO = document.getElementById("playerO").textContent;
const size = 15; // Velikost hrací plochy
let gameActive = true;

// Funkce, která určí, kdo je na tahu
function playerTurn() {
    let xCount = 0;
    let oCount = 0;

    const cells = boardElement.querySelectorAll(".cell");
    cells.forEach(cell => {
        const img = cell.querySelector("img");
        if (img?.alt === "X") xCount++;
        if (img?.alt === "O") oCount++;
    });
    return xCount === oCount 
        ? "<img src='/brand/TdA_Ikonky/PNG/X/X_cervene.png' alt='X' width='10' height='10'>" 
        : "<img src='/brand/TdA_Ikonky/PNG/O/O_modre.png' alt='O' width='10' height='10'>";
}


function loadGridData() {
    const grid = Array.from({ length: 15 }, () => Array(15).fill("")); // Prázdné 2D pole 15x15
    const cells = document.querySelectorAll('#gameBoard .cell'); // Vyber všechny buňky gridu

    cells.forEach((cell, index) => {
        const x = Math.floor(index / 15); // Řádek (x)
        const y = index % 15;            // Sloupec (y)

        const img = cell.querySelector('img'); // Najdi obrázek v buňce, pokud existuje
        grid[x][y] = img ? img.alt : "";      // Pokud je obrázek, vezmi jeho alt, jinak prázdný string
    });

    return grid; // Vrátí 2D pole
}

// Funkce pro provedení tahu
function makeMove(cell) {
    if (cell.innerHTML === "" && gameActive) { // Kontrola, zda je buňka prázdná
        const currentPlayer = playerTurn();
        cell.innerHTML = currentPlayer; // Přidáme ikonu hráče
        const img = cell.querySelector("img");
        const board = JSON.stringify(loadGridData());
        console.log(board);
        if (checkWinningMove(img.alt)) {
            announceWinner(img.alt);
        }
        
            saveBoard(board);
            
       
       
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
        const img = cell.querySelector("img");
        if (img?.alt === player) {
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
        const img = grid[row][col].querySelector("img");
        if (img?.alt === player) {
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
    if(winner === "X") winner = playerX;
    if(winner === "O") winner = playerO;
    alert(`${winner} vyhrál!`);
    gameActive = false;
}

// Přidáme event listener pro hrací plochu
boardElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) { // Pokud klikneme na buňku
        makeMove(event.target);
    }
});


function saveBoard(board){
    var uuid = document.getElementById("uuid").textContent;

     fetch(`/game/${uuid}`, {
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
        }
        return response.json(); // Vrátí JSON data pro další zpracování
    })
    .then(data => {
        console.log(data); 
        window.location.href=`/game/${uuid}`;
    })
    .catch(error => console.error("Error: "+error))   
}
