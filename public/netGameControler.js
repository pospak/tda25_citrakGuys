const socket = io("https://ecb7937d.app.deploy.tourde.app", { transports: ["websocket"] });


const gameid = window.location.pathname.split("/").pop();
socket.emit("joinGame", gameid);

const boardElement = document.getElementById("gameBoard");
let currentTurn = "X"; // Udržuje aktuální tah

// Přijímání hráčů při připojení
socket.on("playerJoined", (data) => {
    document.getElementById("playerX").textContent = data.playerX;
    document.getElementById("playerO").textContent = data.playerO;
});

// Přijímání aktualizací hry
socket.on("updateBoard", ({ boardState, turn }) => {
    console.log("Aktualizovaná hrací deska: ", boardState);
    currentTurn = turn; // Aktualizace tahu
    updateBoardUI(boardState);
});

// Funkce pro tah hráče
function makeMove(cell) {
    if (cell.querySelector("img")) return; // Zabrání dvojkliku
    const player = currentTurn;
    if (player !== playerTurn()) return; // Zabrání neautorizovanému tahu

    // Vytvoření a dočasné zobrazení tahu
    const img = document.createElement("img");
    img.src = player === "X"
        ? "/brand/TdA_Ikonky/PNG/X/X_cervene.png"
        : "/brand/TdA_Ikonky/PNG/O/O_modre.png";
    img.alt = player;
    img.width = 20;
    img.height = 20;
    cell.appendChild(img);

    // Převod hrací desky na pole
    const boardState = Array.from(boardElement.querySelectorAll(".cell")).map(cell => {
        const img = cell.querySelector("img");
        return img ? img.alt : "";
    });

    // Odeslání tahu na server
    socket.emit("move", { board: boardState, gameid });

    // Dočasné zablokování klikání, než přijde odpověď od serveru
    boardElement.style.pointerEvents = "none";
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
    cells.forEach((cell, index) => {
        cell.innerHTML = ""; // Vyčištění starých dat
        if (boardState[index]) {
            const img = document.createElement("img");
            img.src = boardState[index] === "X"
                ? "/brand/TdA_Ikonky/PNG/X/X_cervene.png"
                : "/brand/TdA_Ikonky/PNG/O/O_modre.png";
            img.alt = boardState[index];
            img.width = 20;
            img.height = 20;
            cell.appendChild(img);
        }
    });

    // Po aktualizaci od serveru znovu povolit klikání
    boardElement.style.pointerEvents = "auto";
}

// Kontrola vítězství (převod boardState na 2D pole)
function checkWinningMove(boardState, player) {
    const size = 15;
    const board = [];
    for (let i = 0; i < size; i++) {
        board.push(boardState.slice(i * size, (i + 1) * size));
    }

    for (let i = 0; i < size; i++) {
        if (checkLine(board[i], player)) return true;
        if (checkLine(board.map(row => row[i]), player)) return true;
    }

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
