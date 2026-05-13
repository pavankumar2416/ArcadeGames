const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake = [
  { x: 9 * box, y: 10 * box }
];

let direction = "RIGHT";

let food = randomFood();

let score = 0;

let highScore = localStorage.getItem("snakeHighScore") || 0;
document.getElementById("highScore").innerText = highScore;

let game;
let isPaused = false;

/* ===== FOOD ===== */

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

/* ===== DRAW ===== */

function draw() {

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* Food */

  ctx.fillStyle = "#ff1744";
  ctx.shadowColor = "#ff1744";
  ctx.shadowBlur = 20;

  ctx.fillRect(food.x, food.y, box, box);

  /* Snake */

  snake.forEach((segment, index) => {

    ctx.fillStyle = index === 0 ? "#00ffff" : "#00e676";

    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;

    ctx.fillRect(segment.x, segment.y, box, box);

    ctx.strokeStyle = "#111";
    ctx.strokeRect(segment.x, segment.y, box, box);
  });

  ctx.shadowBlur = 0;

  /* Movement */

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  /* Eat Food */

  if (snakeX === food.x && snakeY === food.y) {

    score++;
    document.getElementById("score").innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
      document.getElementById("highScore").innerText = highScore;
    }

    food = randomFood();

  } else {
    snake.pop();
  }

  const newHead = {
    x: snakeX,
    y: snakeY
  };

  /* Collision */

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvasSize ||
    snakeY >= canvasSize ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over!");
    return;
  }

  snake.unshift(newHead);
}

/* ===== COLLISION ===== */

function collision(head, array) {
  return array.some(segment =>
    head.x === segment.x &&
    head.y === segment.y
  );
}

/* ===== CONTROLS ===== */

document.addEventListener("keydown", event => {

  const key = event.key;

  if (key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  }

  if (key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  }

  if (key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  }

  if (key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  }
});

/* ===== BUTTONS ===== */

document.getElementById("pauseBtn").addEventListener("click", () => {

  isPaused = !isPaused;

  document.getElementById("pauseBtn").innerText =
    isPaused ? "Resume" : "Pause";

  if (isPaused) {
    clearInterval(game);
  } else {
    game = setInterval(draw, 100);
  }
});

document.getElementById("resetBtn").addEventListener("click", resetGame);

/* ===== RESET ===== */

function resetGame() {

  clearInterval(game);

  snake = [
    { x: 9 * box, y: 10 * box }
  ];

  direction = "RIGHT";

  score = 0;

  document.getElementById("score").innerText = score;

  food = randomFood();

  game = setInterval(draw, 100);
}
function restartGame() {

  clearInterval(game);

  snake = [
    { x: 9 * box, y: 10 * box }
  ];

  direction = "RIGHT";

  score = 0;

  document.getElementById("score").innerText = score;

  food = randomFood();

  isPaused = false;

  document.getElementById("pauseBtn").innerText = "Pause";

  game = setInterval(draw, 100);
}


/* ===== START GAME ===== */

game = setInterval(draw, 100);