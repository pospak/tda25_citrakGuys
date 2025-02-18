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
        ? createPlayerImage("X", "/brand/TdA_Ikonky/PNG/X/X_cervene.png") 
        : createPlayerImage("O", "/brand/TdA_Ikonky/PNG/O/O_modre.png");
}

function createPlayerImage(symbol, src) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = symbol;
    img.width = 20;
    img.height = 20;
    return img;
}

function loadGridData() {
    const grid = Array.from({ length: 15 }, () => Array(15).fill("")); // 2D pole
    const cells = document.querySelectorAll('#gameBoard .cell');

    if (cells.length !== 225) {
        console.error("Chyba: Hrací pole nemá správný počet buněk.");
        return grid;
    }

    cells.forEach((cell, index) => {
        const x = Math.floor(index / 15);
        const y = index % 15;

        const img = cell.querySelector('img');
        grid[x][y] = img ? img.alt : "";
    });

    return grid;
}

function makeMove(cell) {
    if (!cell.innerHTML && gameActive) {
        const currentPlayer = playerTurn();
        cell.appendChild(currentPlayer);

        const board = loadGridData();
        console.table(board);

        if (checkWinningMove(currentPlayer.alt, board)) {
            announceWinner(currentPlayer.alt);
        }

        saveBoard(JSON.stringify(board));
    }
}

function checkWinningMove(player, board) {
    const size = 15;

    for (let i = 0; i < size; i++) {
        if (checkLine(board[i], player)) return true; // Řádky
        if (checkLine(board.map(row => row[i]), player)) return true; // Sloupce
    }

    for (let row = 0; row <= size - 5; row++) {
        for (let col = 0; col <= size - 5; col++) {
            if (checkDiagonal(board, row, col, player, 1, 1)) return true; // Hlavní diagonála
        }
        for (let col = 4; col < size; col++) {
            if (checkDiagonal(board, row, col, player, 1, -1)) return true; // Vedlejší diagonála
        }
    }
    return false;
}

function checkLine(line, player) {
    let count = 0;
    for (let cell of line) {
        if (cell === player) {
            count++;
            if (count === 5) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

function checkDiagonal(grid, startRow, startCol, player, rowInc, colInc) {
    let count = 0;
    for (let i = 0; i < 5; i++) {
        const row = startRow + i * rowInc;
        const col = startCol + i * colInc;
        if (grid[row][col] === player) {
            count++;
            if (count === 5) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

function announceWinner(winner) {
    alert(`${winner} vyhrál!`);
    gameActive = false;
}

boardElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) {
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
        window.location.href=`/game/${uuid}#gameBoard`;
    })
    .catch(error => console.error("Error: "+error))   
}


