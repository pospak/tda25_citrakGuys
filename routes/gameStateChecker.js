
function getGameState(board) {
    const size = 15; // Velikost hrací plochy
    const directions = [
        { dx: 1, dy: 0 }, // Horizontálně
        { dx: 0, dy: 1 }, // Vertikálně
        { dx: 1, dy: 1 }, // Diagonálně zleva doprava
        { dx: 1, dy: -1 } // Diagonálně zprava doleva
    ];

    let totalMoves = 0; // Počet tahů na herní ploše
    let countX = 0; // Počet "X"
    let countO = 0; // Počet "O"

    // Validace, jestli je board správně formátováno
    if (!Array.isArray(board) || board.length !== size || board.some(row => row.length !== size)) {
        console.error("Invalid board size or format:", board);
        return "invalid"; // Pokud board není 15x15, je nevalidní
    }

    try {
        // Spočítání tahů a kontrola nevalidních znaků
        for (let row of board) {
            for (let cell of row) {
                if (cell === "X") {
                    totalMoves++;
                    countX++;
                } else if (cell === "O") {
                    totalMoves++;
                    countO++;
                } else if (cell !== "") {
                    console.error("Invalid symbol found:", cell);
                    return "invalid"; // Nevalidní symbol
                }
            }
        }

        // Validace počtu symbolů
        if (countO > countX) {
            console.error("Player 'O' has more moves than 'X'.");
            return "invalid"; // Hráč "O" má víc tahů než "X"
        }
        if (countX > countO + 1) {
            console.error("Player 'X' has more than one extra move than 'O'.");
            return "invalid"; // Hráč "X" má víc než o jeden tah navíc
        }

        // Zahájení (5 a méně tahů)
        if (totalMoves <= 5) {
            return "opening";
        }

        // Midgame (6 a více tahů)
        if (totalMoves >= 6) {
            let hasWinningChance = false;

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    if (board[y][x] === "X" || board[y][x] === "O") {
                        if (checkWinningOpportunity(x, y, board[y][x], board, size, directions)) {
                            hasWinningChance = true;
                        }
                    }
                }
            }

            // Kontrola, zda není 4 propojené symboly blokovány jiným symbolem na jedné straně
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const symbol = board[y][x];
                    if (symbol === "X" || symbol === "O") {
                        // Kontrola na všechny směry
                        for (const { dx, dy } of directions) {
                            let count = 0;
                            let blockedStart = false;
                            let blockedEnd = false;

                            for (let i = -4; i <= 4; i++) {
                                const nx = x + i * dx;
                                const ny = y + i * dy;

                                if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                                    if (board[ny][nx] === symbol) {
                                        count++;
                                    } else if (board[ny][nx] !== "") {
                                        if (i < 0) blockedStart = true;
                                        if (i > 0) blockedEnd = true;
                                    }
                                }
                            }

                            // Pokud je propojení 4 symbolů blokováno jiným symbolem z jedné strany, je to midgame
                            if (count === 4 && (blockedStart || blockedEnd)) {
                                return "midgame"; // Pokud je propojení blokováno z jedné strany, je to midgame
                            }
                        }
                    }
                }
            }

            if (hasWinningChance) {
                return "endgame"; // Koncovka
            } else {
                return "midgame"; // Midgame pokračuje
            }
        }

        return "invalid"; // Pokud neplatí žádná z předchozích podmínek, je to nevalidní
    } catch (err) {
        console.error("Error in getGameState:", err.message);
        return "invalid"; // Pokud dojde k chybě, vrátí se "invalid"
    }
}

// Funkce pro kontrolu možnosti propojení 5 symbolů
function checkWinningOpportunity(x, y, symbol, board, size, directions) {
    for (const { dx, dy } of directions) {
        let count = 0;
        let blockedStart = false;
        let blockedEnd = false;

        for (let i = -4; i <= 4; i++) {
            const nx = x + i * dx;
            const ny = y + i * dy;

            if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                if (board[ny][nx] === symbol) {
                    count++;
                } else if (board[ny][nx] !== "") {
                    if (i < 0) blockedStart = true;
                    if (i > 0) blockedEnd = true;
                }
            }
        }

        // Pokud hráč může propojit 5 symbolů
        if (count === 4 && (!blockedStart || !blockedEnd)) {
            return true;
        }
    }
    return false;
}

// Export funkce pro použití v jiných souborech
module.exports = { getGameState };
