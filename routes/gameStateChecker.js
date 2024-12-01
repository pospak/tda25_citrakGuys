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
                return "invalid"; // Nevalidní symbol
            }
        }
    }

    // Validace počtu symbolů
    if (countO > countX) {
        return "invalid"; // Hráč "O" má víc tahů než "X"
    }
    if (countX > countO + 1) {
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

        if (hasWinningChance) {
            return "endgame"; // Koncovka
        } else {
            return "midgame"; // Midgame pokračuje
        }
    }

    return "invalid"; // Pokud se nepodaří určit stav
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
