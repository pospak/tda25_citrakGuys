// Najdeme element #gameBoard
const boardElement = document.getElementById("gameBoard");
 var bot = document.getElementById("tada");
        bot.src = "/brand/TdA_Ikonky/PNG/Idea/zarivka_idea_modre.png"
        var gameActive = true;
function playerTurn() {
    let xCount = 0;
    let oCount = 0;

    // Procházení všech buněk a počítání X a O
    const cells = boardElement.querySelectorAll(".cell"); // Předpokládáme, že každá buňka má třídu 'cell'
    cells.forEach(cell => {
        if (cell.textContent === "X") xCount++;
        if (cell.textContent === "O") oCount++;
    });

    
    // Určení, kdo je na tahu na základě počtu X a O
    return xCount === oCount ? "X" : "O"; // X začíná, takže má hrát, když jsou počty X a O stejné
}

// Funkce, která vykoná tah a vloží X nebo O do kliknuté buňky
function makeMove(cell) {
    const currentPlayer = playerTurn();

    // Kontrola, jestli je na tahu hráč X, jinak se zobrazí zpráva
    if (currentPlayer === "O") {
        alert("Počkej, než počítač dokončí svůj tah.");
        return;
    }

    // Pokud je buňka prázdná, provedeme tah
    if (cell.textContent === "" && gameActive == true) {
        cell.textContent = currentPlayer;
checkGameStatus();
        bot.src="/brand/TdA_Ikonky/PNG/Thinking/zarivka_thinking_modre.png"

        // Simulace tahu počítače (O) po tahu hráče
        setTimeout(() => {
            computerMove();
            checkGameStatus();
            bot.src = "/brand/TdA_Ikonky/PNG/Idea/zarivka_idea_modre.png"
        }, 3000); // Počkej 1 sekundu před tahem počítače
    } else {
        alert("Tato buňka je již obsazena.");
    }
    
    
}

// Funkce, která provede tah počítače (O)
function computerMove() {
    const cells = Array.from(document.querySelectorAll(".cell"));
    const emptyCells = cells.filter(cell => cell.textContent === "");
    const size = 15; // Velikost hrací plochy

    if (emptyCells.length === 0) {
        alert("Všechna pole jsou obsazena, hra skončila remízou!");
        return;
    }

    const grid = [];
    while (cells.length) grid.push(cells.splice(0, size));

    // Funkce pro vyhodnocení pozice na základě hrozby hráče nebo příležitosti pro počítač
    function evaluateThreat(player, lengthNeeded) {
        const moves = [];
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (grid[row][col].textContent === "") {
                    const directions = [
                        [0, 1], [1, 0], [1, 1], [1, -1] // Horizontální, vertikální, diagonály
                    ];
                    for (let [dx, dy] of directions) {
                        let count = 0;
                        let openStart = false, openEnd = false;
    
                        // Zkontroluj směr dopředu
                        for (let step = 1; step <= 4; step++) {
                            const nx = row + dx * step;
                            const ny = col + dy * step;
                            if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                                if (grid[nx][ny].textContent === player) {
                                    count++;
                                } else if (grid[nx][ny].textContent === "") {
                                    openEnd = true;
                                    break;
                                } else {
                                    break;
                                }
                            }
                        }
    
                        // Zkontroluj směr dozadu
                        for (let step = 1; step <= 4; step++) {
                            const nx = row - dx * step;
                            const ny = col - dy * step;
                            if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                                if (grid[nx][ny].textContent === player) {
                                    count++;
                                } else if (grid[nx][ny].textContent === "") {
                                    openStart = true;
                                    break;
                                } else {
                                    break;
                                }
                            }
                        }
    
                        // Pokud najdeš hrozbu nebo příležitost, přidej tah
                        if (count >= lengthNeeded - 1 && (openStart || openEnd)) {
                            moves.push(grid[row][col]);
                        }
                    }
                }
            }
        }
        return moves;
    }



    // Nejvyšší priorita: Blokuj hráče s 4 v řadě
    let bestMoves = evaluateThreat("X", 5);
    if (bestMoves.length > 0) {
        bestMoves[Math.floor(Math.random() * bestMoves.length)].textContent = "O";
        return;
    }

    // Střední priorita: Blokuj hráče s 3 v řadě (otevřená hrozba)
    bestMoves = evaluateThreat("X", 4);
    if (bestMoves.length > 0) {
        bestMoves[Math.floor(Math.random() * bestMoves.length)].textContent = "O";
        return;
    }

    // Nízká priorita: Pokus se vytvořit vlastní 4 v řadě
    bestMoves = evaluateThreat("O", 4);
    if (bestMoves.length > 0) {
        bestMoves[Math.floor(Math.random() * bestMoves.length)].textContent = "O";
        return;
    }

    // Poslední možnost: Hraj náhodně
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = "O";
}

function checkWinner(player) {
    const size = 15; // Velikost hrací plochy
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

    // Kontrola diagonál
    for (let row = 0; row <= size - 5; row++) {
        for (let col = 0; col <= size - 5; col++) {
            if (checkDiagonal(grid, row, col, player, 1, 1)) return true;
        }
        for (let col = 4; col < size; col++) {
            if (checkDiagonal(grid, row, col, player, 1, -1)) return true;
        }
    }
    return false;
}

function checkLine(line, player) {
    let count = 0;
    for (let cell of line) {
        if (cell.textContent === player) {
            count++;
            if (count === 5) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

function checkDiagonal(grid, row, col, player, rowStep, colStep) {
    let count = 0;
    for (let i = 0; i < 5; i++) {
        if (grid[row + i * rowStep]?.[col + i * colStep]?.textContent === player) {
            count++;
            if (count === 5) return true;
        } else {
            break;
        }
    }
    return false;
}

// Po každém tahu hráče nebo počítače zkontrolujeme výhru
function checkGameStatus() {
    if (checkWinner("X")) {
        alert("Hráč vyhrál!");
        gameActive = false;
    } else if (checkWinner("O")) {
        alert("Počítač vyhrál!");
        gameActive = false;
    }
}

// Vytvoříme nový observer s callbackem, který reaguje na změny
const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "attributes") {
            const currentPlayer = playerTurn();
            console.log("Na tahu je:", currentPlayer);
        }
    }
});

// Nastavíme observer pro sledování změn v `#gameBoard`
observer.observe(boardElement, { attributes: true, childList: true, subtree: true });

// Přidáme event listener pro každou buňku hrací plochy
boardElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) { // Pokud klikneme na buňku
        makeMove(event.target);
    }
});

