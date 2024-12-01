// Funkce pro kontrolu stavu hry
function getGameState(board) {
    const size = 15; // Rozměr hracího pole
    const directions = [
      { dx: 1, dy: 0 }, // Horizontálně
      { dx: 0, dy: 1 }, // Vertikálně
      { dx: 1, dy: 1 }, // Diagonálně (zleva doprava)
      { dx: 1, dy: -1 } // Diagonálně (zprava doleva)
    ];
  
    function checkWinningOpportunity(x, y, symbol) {
      for (const { dx, dy } of directions) {
        let count = 0;
        let hasGapBefore = false;
        let hasGapAfter = false;
  
        for (let i = -1; i <= 4; i++) {
          const nx = x + i * dx;
          const ny = y + i * dy;
  
          if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
            if (board[ny][nx] === symbol) {
              count++;
            } else if (board[ny][nx] === "") {
              if (i < 0) hasGapBefore = true;
              if (i > 3) hasGapAfter = true;
            }
          }
        }
  
        if (count === 4 && (hasGapBefore || hasGapAfter)) {
          return true;
        }
      }
      return false;
    }
  
    let hasWinningOpportunity = false;
  
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (board[y][x] === "X" || board[y][x] === "O") {
          if (checkWinningOpportunity(x, y, board[y][x])) {
            hasWinningOpportunity = true;
            break;
          }
        }
      }
    }
  
    if (hasWinningOpportunity) {
      return "endgame"; // Koncovka
    } else {
      return "midgame"; // Hra pokračuje
    }
  }
  
  // Export funkce pro použití v jiných souborech
  module.exports = {
    getGameState,
  };
  