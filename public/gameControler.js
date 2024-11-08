// Najdeme element #gameBoard
const boardElement = document.getElementById("gameBoard");

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

const size = 15; // Velikost hrací plochy
let gameActive = true; // Stav hry

function checkWinningMove(symbol) {
    const cells = Array.from(boardElement.querySelectorAll(".cell"));
    
    // Kontrola horizontálně, vertikálně a diagonálně pro čtyři v řadě
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const index = i * size + j;

            // Horizontální
            if (j <= size - 4 && cells[index].textContent === symbol &&
                cells[index + 1].textContent === symbol &&
                cells[index + 2].textContent === symbol &&
                cells[index + 3].textContent === symbol) {
                return true;
            }

            // Vertikální
            if (i <= size - 4 && cells[index].textContent === symbol &&
                cells[index + size].textContent === symbol &&
                cells[index + 2 * size].textContent === symbol &&
                cells[index + 3 * size].textContent === symbol) {
                return true;
            }

            // Diagonální (zleva doprava)
            if (i <= size - 4 && j <= size - 4 &&
                cells[index].textContent === symbol &&
                cells[index + size + 1].textContent === symbol &&
                cells[index + 2 * (size + 1)].textContent === symbol &&
                cells[index + 3 * (size + 1)].textContent === symbol) {
                return true;
            }

            // Diagonální (zprava doleva)
            if (i <= size - 4 && j >= 3 &&
                cells[index].textContent === symbol &&
                cells[index + size - 1].textContent === symbol &&
                cells[index + 2 * (size - 1)].textContent === symbol &&
                cells[index + 3 * (size - 1)].textContent === symbol) {
                return true;
            }
        }
    }
    return false;
}

function blockOrWin(symbol) {
    const cells = Array.from(boardElement.querySelectorAll(".cell"));

    // Hledání možností pro vítězství nebo blokaci
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const index = i * size + j;

            // Horizontální blokování
            if (j <= size - 4 && cells[index].textContent === symbol &&
                cells[index + 1].textContent === symbol &&
                cells[index + 2].textContent === symbol &&
                cells[index + 3].textContent === "") {
                return cells[index + 3];
            }
            if (j <= size - 4 && cells[index].textContent === "" &&
                cells[index + 1].textContent === symbol &&
                cells[index + 2].textContent === symbol &&
                cells[index + 3].textContent === symbol) {
                return cells[index];
            }

            // Vertikální blokování
            if (i <= size - 4 && cells[index].textContent === symbol &&
                cells[index + size].textContent === symbol &&
                cells[index + 2 * size].textContent === symbol &&
                cells[index + 3 * size].textContent === "") {
                return cells[index + 3 * size];
            }
            if (i <= size - 4 && cells[index].textContent === "" &&
                cells[index + size].textContent === symbol &&
                cells[index + 2 * size].textContent === symbol &&
                cells[index + 3 * size].textContent === symbol) {
                return cells[index];
            }

            // Diagonální blokování (zleva doprava)
            if (i <= size - 4 && j <= size - 4 &&
                cells[index].textContent === symbol &&
                cells[index + size + 1].textContent === symbol &&
                cells[index + 2 * (size + 1)].textContent === "" &&
                cells[index + 3 * (size + 1)].textContent === symbol) {
                return cells[index + 2 * (size + 1)];
            }
            if (i <= size - 4 && j <= size - 4 &&
                cells[index].textContent === "" &&
                cells[index + size + 1].textContent === symbol &&
                cells[index + 2 * (size + 1)].textContent === symbol &&
                cells[index + 3 * (size + 1)].textContent === symbol) {
                return cells[index];
            }

            // Diagonální blokování (zprava doleva)
            if (i <= size - 4 && j >= 3 &&
                cells[index].textContent === symbol &&
                cells[index + size - 1].textContent === symbol &&
                cells[index + 2 * (size - 1)].textContent === "" &&
                cells[index + 3 * (size - 1)].textContent === symbol) {
                return cells[index + 2 * (size - 1)];
            }
            if (i <= size - 4 && j >= 3 &&
                cells[index].textContent === "" &&
                cells[index + size - 1].textContent === symbol &&
                cells[index + 2 * (size - 1)].textContent === symbol &&
                cells[index + 3 * (size - 1)].textContent === symbol) {
                return cells[index];
            }
        }
    }
    return null;
}

function computerMove() {
    const currentPlayer = playerTurn();

    if (currentPlayer === "O" && gameActive) {
        // 1. Zkontroluj, zda může vyhrát
        let winningMove = blockOrWin("O");
        if (winningMove) {
            winningMove.textContent = "O";
            if (checkWinningMove("O")) {
                announceWinner("Počítač vyhrál!");
                gameActive = false;
                return;
            }
            return;
        }

        // 2. Zablokuj hráče
        let blockingMove = blockOrWin("X");
        if (blockingMove) {
            blockingMove.textContent = "O";
            if (checkWinningMove("X")) {
                announceWinner("Hráč vyhrál!");
                gameActive = false;
                return;
            }
            return;
        }

        // 3. Náhodný tah, pokud není vítězný ani blokovací tah
        const emptyCells = Array.from(boardElement.querySelectorAll(".cell")).filter(cell => cell.textContent === "");
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            randomCell.textContent = "O";
            if (checkWinningMove("O")) {
                announceWinner("Počítač vyhrál!");
                gameActive = false;
            }
        }
    }
}

function announceWinner(winner) {
    alert(winner);
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

function makeMove(cell) {
    // Pokud je buňka prázdná
    if (cell.textContent === "" && gameActive) {
        cell.innerHTML = "X"; // Hráč "X" udělá tah
        if (checkWinningMove("X")) {
            announceWinner("Hráč vyhrál!");
            gameActive = false;
            return;
        }
        // Následuje tah počítače
        computerMove();
    }
}

// Nastavíme observer pro sledování změn v `#gameBoard`
observer.observe(boardElement, { attributes: true, childList: true, subtree: true });

// Přidáme event listener pro každou buňku hrací plochy
boardElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) { // Pokud klikneme na buňku
        makeMove(event.target);
    }
});


function deleteGame(uuid) {
   event.preventDefault();
   // Po úspěšném smazání přesměruj na /games
   
    fetch(`/games/${uuid}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        console.log("ok");
        setTimeout(() => {
            window.location.replace("/games");
          }, 2000);
      } else {
        console.error("Nepodařilo se smazat hru.");
        window.location.href = "/error";
      }
    })
    .catch(error => console.error("Chyba: ", error));
  }
  

