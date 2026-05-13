const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let score = 0;
let highScore = localStorage.getItem("tetrisHighScore") || 0;

document.getElementById("highScore").innerText = highScore;

const board = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(0)
);

const colors = [
  null,
  "cyan",
  "blue",
  "orange",
  "yellow",
  "green",
  "purple",
  "red"
];

const pieces = [
  [],
  [[1,1,1,1]],

  [
    [2,0,0],
    [2,2,2]
  ],

  [
    [0,0,3],
    [3,3,3]
  ],

  [
    [4,4],
    [4,4]
  ],

  [
    [0,5,5],
    [5,5,0]
  ],

  [
    [0,6,0],
    [6,6,6]
  ],

  [
    [7,7,0],
    [0,7,7]
  ]
];

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
       ctx.fillStyle = colors[value];
ctx.fillRect(x + offset.x, y + offset.y, 1, 1);

/* Inner Glow */
ctx.shadowColor = colors[value];
ctx.shadowBlur = 15;

/* Border */
ctx.lineWidth = 0.05;
ctx.strokeStyle = "#ffffff";
ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);

/* Small Highlight */
ctx.fillStyle = "rgba(255,255,255,0.25)";
ctx.fillRect(x + offset.x + 0.08, y + offset.y + 0.08, 0.25, 0.25);

ctx.shadowBlur = 0;
      }
    });
  });
}

function drawBoard() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(board, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function merge(board, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function collide(board, player) {
  const [matrix, pos] = [player.matrix, player.pos];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (
        matrix[y][x] !== 0 &&
        (
          board[y + pos.y] &&
          board[y + pos.y][x + pos.x]
        ) !== 0
      ) {
        return true;
      }
    }
  }

  return false;
}

function playerDrop() {
  player.pos.y++;

  if (collide(board, player)) {
    player.pos.y--;
    merge(board, player);
    clearLines();
    playerReset();
  }

  dropCounter = 0;
}

function clearLines() {
  let lines = 0;

  outer:
  for (let y = board.length - 1; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x] === 0) {
        continue outer;
      }
    }

    const row = board.splice(y, 1)[0].fill(0);
    board.unshift(row);
    y++;

    lines++;
  }

  if (lines > 0) {
    score += lines * 10;

    document.getElementById("score").innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("tetrisHighScore", highScore);

      document.getElementById("highScore").innerText = highScore;
    }
  }
}

function rotate(matrix) {
  return matrix[0].map((_, i) =>
    matrix.map(row => row[i]).reverse()
  );
}

function playerRotate() {
  const rotated = rotate(player.matrix);

  const oldMatrix = player.matrix;
  player.matrix = rotated;

  if (collide(board, player)) {
    player.matrix = oldMatrix;
  }
}

function playerMove(dir) {
  player.pos.x += dir;

  if (collide(board, player)) {
    player.pos.x -= dir;
  }
}

function randomPiece() {
  const rand =
    Math.floor(Math.random() * (pieces.length - 1)) + 1;

  return pieces[rand];
}

function playerReset() {
  player.matrix = randomPiece();

  player.pos.y = 0;
  player.pos.x =
    Math.floor(COLS / 2) -
    Math.floor(player.matrix[0].length / 2);

  if (collide(board, player)) {
    alert("Game Over!");

    board.forEach(row => row.fill(0));

    score = 0;

    document.getElementById("score").innerText = score;
  }
}

const player = {
  pos: { x: 0, y: 0 },
  matrix: null
};

document.addEventListener("keydown", event => {
  if (isPaused) return;

  if (event.key === "ArrowLeft") {
    playerMove(-1);
  }
  else if (event.key === "ArrowRight") {
    playerMove(1);
  }
  else if (event.key === "ArrowDown") {
    playerDrop();
  }
  else if (event.key === "ArrowUp") {
    playerRotate();
  }
});

let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;

let isPaused = false;

function update(time = 0) {
  if (isPaused) return;

  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;

  if (dropCounter > dropInterval) {
    playerDrop();
  }

  drawBoard();

  requestAnimationFrame(update);
}

document.getElementById("pauseBtn").addEventListener("click", () => {
  isPaused = !isPaused;

  document.getElementById("pauseBtn").innerText =
    isPaused ? "Resume" : "Pause";

  if (!isPaused) {
    update();
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  board.forEach(row => row.fill(0));

  score = 0;

  document.getElementById("score").innerText = score;

  playerReset();
});

playerReset();
update();