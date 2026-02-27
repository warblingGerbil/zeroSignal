const cells = Array.from(document.querySelectorAll(".cell"));
const turnIndicator = document.getElementById("turnIndicator");
const winListEl = document.getElementById("winList");
const overlay = document.getElementById("overlay");
const overlayMessage = document.getElementById("overlayMessage");
const playAgainBtn = document.getElementById("playAgainBtn");

let currentPlayer = "X";
let movesCount = 0;
let board = Array(9).fill(null);

let possibleWins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function renderWinList() {
  winListEl.innerHTML = "";
  possibleWins.forEach(line => {
    const li = document.createElement("li");
    li.textContent = `cells ${line[0] + 1}-${line[1] + 1}-${line[2] + 1}`;
    winListEl.appendChild(li);
  });

  if (possibleWins.length === 0) {
    const li = document.createElement("li");
    li.textContent = "no remaining win lines";
    winListEl.appendChild(li);
  }
}

function updateTurnIndicator() {
  const playerLabel = currentPlayer === "X" ? "Player 1 (X)" : "Player 2 (O)";
  turnIndicator.textContent = `${playerLabel} · your move`;
}

function isGameOver() {
  return overlay.classList.contains("active");
}

function showOverlay(result) {
  let message = "";

  if (result === "X") {
    message = "player 1 (x) wins";
  } else if (result === "O") {
    message = "player 2 (o) wins";
  } else if (result === "draw") {
    message = "draw · no more moves";
  }

  overlayMessage.textContent = message;
  overlay.classList.add("active");
  cells.forEach(c => (c.disabled = true));
}

function checkWinsAndPrune() {
  let winnerFound = false;

  possibleWins = possibleWins.filter(line => {
    const values = line.map(i => board[i]);
    const hasX = values.includes("X");
    const hasO = values.includes("O");

    if (hasX && hasO) {
      return false;
    }

    if (values[0] && values[0] === values[1] && values[1] === values[2]) {
      winnerFound = true;
      showOverlay(values[0]);
      return false;
    }

    return true;
  });

  renderWinList();
  return winnerFound;
}

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.dataset.index, 10);

  if (board[index] !== null || isGameOver()) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  movesCount++;

  if (movesCount >= 5) {
    checkWinsAndPrune();
  }

  if (!isGameOver() && movesCount === 9) {
    showOverlay("draw");
    return;
  }

  if (!isGameOver()) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnIndicator();
  }
}

function resetGame() {
  board = Array(9).fill(null);
  possibleWins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  movesCount = 0;
  currentPlayer = "X";
  cells.forEach(c => {
    c.textContent = "";
    c.disabled = false;
  });
  overlay.classList.remove("active");
  renderWinList();
  updateTurnIndicator();
}

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

playAgainBtn.addEventListener("click", resetGame);

renderWinList();
updateTurnIndicator();
