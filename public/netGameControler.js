const socket = io("https://ecb7937d.app.deploy.tourde.app");

// Připojení ke konkrétní hře
const gameid = window.location.pathname.split("/").pop();
socket.emit("joinGame", gameid);

const boardElement = document.getElementById("gameBoard");

// Přijímání hráčů při připojení
socket.on("playerJoined", (data) => {
    document.getElementById("playerX").textContent = data.playerX;
    document.getElementById("playerO").textContent = data.playerO;
});

// Přijímání aktualizací hry

socket.on("updateBoard", (boardState) => {
    console.log("Aktualizovaná hrací deska: ", boardState);
    updateBoardUI(boardState);
});

// Kliknutí na pole

// Funkce pro tah hráče
function makeMove(cell) {
    const currentPlayer = playerTurn();
    const img = document.createElement("img");
    img.src = currentPlayer === "X" 
        ? "/brand/TdA_Ikonky/PNG/X/X_cervene.png" 
        : "/brand/TdA_Ikonky/PNG/O/O_modre.png";
    img.alt = currentPlayer;
    img.width = 20;
    img.height = 20;
    cell.appendChild(img);

    const boardState = Array.from(boardElement.querySelectorAll(".cell")).map(cell => {
        const img = cell.querySelector("img");
        return img ? img.alt : "";
    });

    console.log("Odesílám tah: ", { board: boardState, gameid }); // LOGOVÁNÍ

    socket.emit("move", { board: boardState, gameid });

    if (checkWinningMove()) {
        alert(`${currentPlayer} vyhrál!`);
    }
}
// Přepočítání, kdo je na tahu
function playerTurn() {
    let xCount = 0, oCount = 0;
    boardElement.querySelectorAll(".cell img").forEach(img => {
        if (img.alt === "X") xCount++;
        if (img.alt === "O") oCount++;
    });
    return xCount === oCount ? "X" : "O";
}

// Aktualizace UI podle serveru
function updateBoardUI(boardState) {
    const cells = boardElement.querySelectorAll(".cell");
    boardState.forEach((val, index) => {
        if (val && !cells[index].querySelector("img")) {
            const img = document.createElement("img");
            img.src = val === "X" 
                ? "/brand/TdA_Ikonky/PNG/X/X_cervene.png" 
                : "/brand/TdA_Ikonky/PNG/O/O_modre.png";
            img.alt = val;
            img.width = 20;
            img.height = 20;
            cells[index].appendChild(img);
        }
    });
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
    if (event.target.classList.contains("cell") && !event.target.querySelector("img")) { 
        makeMove(event.target);
    }
});