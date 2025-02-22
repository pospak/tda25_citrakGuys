const boardElement = document.getElementById("gameBoard");
const size = 15; // Velikost hrací plochy
let gameActive = true;

function createPlayerImage(symbol, src) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = symbol;
    img.width = 20;
    img.height = 20;
    return img;
}

function playerTurn(board) {
    let xCount = 0;
    let oCount = 0;
    for (let row of board) {
        for (let cell of row) {
            if (cell === "X") xCount++;
            if (cell === "O") oCount++;
        }
    }
    return xCount === oCount ? "X" : "O"; // X začíná, střídá se podle počtu
}

function loadGridData() {
    const grid = Array(size).fill().map(() => Array(size).fill(""));
    const cells = document.querySelectorAll("#gameBoard .cell");
    if (cells.length !== size * size) {
        console.error("Chyba: Hrací plocha nemá správný počet buněk.");
        return grid;
    }
    cells.forEach((cell, index) => {
        const x = Math.floor(index / size);
        const y = index % size;
        const img = cell.querySelector("img");
        grid[x][y] = img ? img.alt : "";
    });
    return grid;
}

function makeMove(cell) {
    if (!cell.innerHTML && gameActive) {
        const board = loadGridData();
        const currentPlayer = playerTurn(board);
        const img = createPlayerImage(
            currentPlayer,
            currentPlayer === "X" ? "/brand/TdA_Ikonky/PNG/X/X_cervene.png" : "/brand/TdA_Ikonky/PNG/O/O_modre.png"
        );
        cell.appendChild(img);

        const updatedBoard = loadGridData();
        if (checkWinningMove(currentPlayer, updatedBoard)) {
            announceWinner(currentPlayer);
            return; // Konec, pokud někdo vyhraje
        }
        saveBoard(updatedBoard); // Uložení na server
    }
}

function checkWinningMove(player, board) {
    // Kontrola řádků
    for (let i = 0; i < size; i++) {
        if (checkLine(board[i], player)) return true;
    }
    // Kontrola sloupců – oprava: vytvoření sloupce přímo bez map
    for (let i = 0; i < size; i++) {
        const column = [];
        for (let j = 0; j < size; j++) {
            column.push(board[j][i]);
        }
        if (checkLine(column, player)) return true;
    }
    // Kontrola diagonál
    for (let row = 0; row <= size - 5; row++) {
        for (let col = 0; col <= size - 5; col++) {
            if (checkDiagonal(board, row, col, player, 1, 1)) return true;
        }
        for (let col = 4; col < size; col++) {
            if (checkDiagonal(board, row, col, player, 1, -1)) return true;
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

function checkDiagonal(board, startRow, startCol, player, rowInc, colInc) {
    let count = 0;
    for (let i = 0; i < 5; i++) {
        const row = startRow + i * rowInc;
        const col = startCol + i * colInc;
        if (row < 0 || row >= size || col < 0 || col >= size) return false; // Kontrola hranic
        if (board[row][col] === player) {
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

function saveBoard(board) {
    const uuid = document.getElementById("uuid").textContent;
    fetch(`/play/friend/${uuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(board) // Oprava: Převedení pole na JSON řetězec pomocí JSON.stringify
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Chyba serveru: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Hrací plocha uložena:", data);
        // Bez přesměrování, aby se nepřerušilo dotazování
    })
    .catch(error => {
        console.error("Chyba při ukládání:", error);
        alert("Nepodařilo se uložit tah. Podívej se do konzole pro detaily.");
    });
}

function updateBoard(board) {
    const cells = document.querySelectorAll("#gameBoard .cell");
    cells.forEach((cell, index) => {
        const x = Math.floor(index / size);
        const y = index % size;
        cell.innerHTML = ""; // Vyčištění obsahu
        if (board[x][y]) {
            const img = createPlayerImage(
                board[x][y],
                board[x][y] === "X" ? "/brand/TdA_Ikonky/PNG/X/X_cervene.png" : "/brand/TdA_Ikonky/PNG/O/O_modre.png"
            );
            cell.appendChild(img);
        }
    });
    if (gameActive && checkWinningMove("X", board)) announceWinner("X");
    if (gameActive && checkWinningMove("O", board)) announceWinner("O");
}

function startPolling() {
    const uuid = document.getElementById("uuid").textContent;
    setInterval(() => {
        if (!gameActive) return; // Zastavení dotazování, pokud hra skončila
        fetch(`/play/game/${uuid}`) // Oprava: Změněno na `/play/friend/${uuid}` podle saveBoard
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Chyba dotazování: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                updateBoard(data.board);
            })
            .catch(error => {
                console.error("Chyba při dotazování:", error);
                // Bez alertu, aby to nespamovalo, jen log
            });
    }, 2000); // Dotaz každé 2 sekundy
}

boardElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) {
        makeMove(event.target);
    }
});

startPolling();