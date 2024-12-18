// Najdeme element #gameBoard
const boardElement = document.getElementById("gameBoard");

const size = 15; // Velikost hrací plochy
let gameActive = true;

// Získání aktuálního hráče z localStorage nebo inicializace na "X"
let currentPlayer = localStorage.getItem("currentPlayer") || "X";

// Načti uložený stav hry z localStorage, pokud existuje
const savedBoard = JSON.parse(localStorage.getItem("savedBoard")) || Array(size).fill(null).map(() => Array(size).fill(""));

if (savedBoard) {
    loadBoard(savedBoard);
}

// Funkce pro načtení hrací plochy ze stavu
function loadBoard(board) {
    const cells = boardElement.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        cell.textContent = board[row][col] || "";
    });
}

// Funkce pro uložení aktuálního stavu hry do localStorage
function saveToLocalStorage(board) {
    localStorage.setItem("savedBoard", JSON.stringify(board));
    localStorage.setItem("currentPlayer", currentPlayer);
}

// Funkce, která určí, kdo je na tahu
function playerTurn() {
    return currentPlayer;
}

// Funkce pro provedení tahu
function makeMove(cell) {
    if (cell.innerHTML === "" && gameActive) { // Kontrola, zda je buňka prázdná
        cell.innerHTML = currentPlayer; // Přidáme text "X" nebo "O" do buňky

        // Uložíme tah do localStorage
        const board = getBoardState();
        saveToLocalStorage(board);

        // Kontrola, zda tah není vítězný
        if (checkWinningMove(currentPlayer)) {
            announceWinner(currentPlayer); // Oznámíme vítěze
        } else {
            // Přepneme hráče
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            localStorage.setItem("currentPlayer", currentPlayer); // Uložíme aktuálního hráče
        }
    }
}

// Funkce pro získání aktuálního stavu hrací plochy
function getBoardState() {
    const board = Array(size).fill(null).map(() => Array(size).fill(""));
    const cells = boardElement.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        board[row][col] = cell.textContent.trim();
    });
    return board;
}

// Kontrola vítězného tahu (beze změny)
function checkWinningMove(player) {
    const board = getBoardState();

    // Kontrola řádků
    for (let row of board) {
        if (checkLine(row, player)) return true;
    }

    // Kontrola sloupců
    for (let col = 0; col < size; col++) {
        const column = board.map(row => row[col]);
        if (checkLine(column, player)) return true;
    }

    // Kontrola hlavní diagonály (zleva doprava)
    for (let row = 0; row <= size - 5; row++) {
        for (let col = 0; col <= size - 5; col++) {
            if (checkDiagonal(board, row, col, player, 1, 1)) return true;
        }
    }

    // Kontrola vedlejší diagonály (zprava doleva)
    for (let row = 0; row <= size - 5; row++) {
        for (let col = 4; col < size; col++) {
            if (checkDiagonal(board, row, col, player, 1, -1)) return true;
        }
    }

    return false;
}

// Funkce pro ukládání hry do databáze
function saveGame() {
    const uuid = document.getElementById("uuid").textContent;
    const board = getBoardState();

    fetch(`/game/${uuid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            board: board, // Pole s daty 15x15
            currentPlayer: currentPlayer, // Uložíme aktuálního hráče
            gameActive: gameActive // Stav hry (aktivní nebo ukončená)
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Nepodařilo se uložit hru na server.");
            } else {
                console.log("Hra byla úspěšně uložena.");
            }
        })
        .catch(error => console.error("Chyba při ukládání hry:", error));
}

// Funkce pro vyhlášení vítěze
function announceWinner(winner) {
    alert(`${winner} vyhrál!`);
    gameActive = false;
    saveToLocalStorage(getBoardState()); // Uložíme finální stav hry
}

// Přidáme event listener pro hrací plochu
boardElement.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell"); // Najdi nejbližší .cell

    if (cell) { // Pokud existuje .cell
        makeMove(cell);
        saveGame();
    }
});
