const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const birdImg = new Image();
birdImg.src = 'images/bird.png';

const pipeImg = new Image();
pipeImg.src = 'images/pipeNorth.png';

const backgroundImg = new Image();
backgroundImg.src = 'images/background.png';

const enemyBirdImg = new Image();
enemyBirdImg.src = 'assets/enemy_bird.png';

const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  velocity: 0,
  gravity: 0.5,
  jumpHeight: -10,
};

let pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpawnInterval = 2000; // milliseconds
const enemyBirds = [];
const enemyBirdWidth = 40;
const enemyBirdHeight = 30;
const enemyBirdSpeed = 2;
let lastPipeSpawnTime = 0;
let score = 0;
let pipeSpeed = 2; // Initial pipe scrolling speed
let speedIncrementInterval = 10000; // Milliseconds before increasing speed
let lastSpeedIncrementTime = 0;

function createEnemyBird() {
  const yPosition = Math.random() * (canvas.height - enemyBirdHeight);
  enemyBirds.push({ x: canvas.width, y: yPosition });
}

function drawEnemyBirds() {
  for (const bird of enemyBirds) {
    ctx.drawImage(enemyBirdImg, bird.x, bird.y, enemyBirdWidth, enemyBirdHeight);
  }
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  for (const pipe of pipes) {
    ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.drawImage(pipeImg, pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
  }
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
}

function updateEnemyBirds() {
  for (const bird of enemyBirds) {
    bird.x -= enemyBirdSpeed;
  }
  enemyBirds.forEach((bird, index) => {
    if (bird.x + enemyBirdWidth <= 0) {
      enemyBirds.splice(index, 1);
    }
  });
}

const currentTime = Date.now();
{
  if (currentTime - lastPipeSpawnTime >= pipeSpawnInterval) {
    createEnemyBird();
    lastPipeSpawnTime = currentTime;
  }
}

function handleJump() {
  bird.velocity = bird.jumpHeight;
}

function updatePipes() {
  for (const pipe of pipes) {
    pipe.x -= 2;
  }
  pipes = pipes.filter((pipe) => pipe.x + pipeWidth >= 0);
  const currentTime = Date.now();
  if (currentTime - lastPipeSpawnTime >= pipeSpawnInterval) {
    spawnPipe();
    lastPipeSpawnTime = currentTime;
  }
}

function spawnPipe() {
  const minPipeHeight = 50;
  const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
  const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
  pipes.push({ x: canvas.width, topHeight });
}

function updatePipeSpeed() {
    const currentTime = Date.now();
    if (currentTime - lastSpeedIncrementTime >= speedIncrementInterval) {
      pipeSpeed += 0.5; // Increase pipe scrolling speed by 0.5 every 10 seconds
      lastSpeedIncrementTime = currentTime;
    }
  }
  

function checkCollision() {
  if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
    endGame();
  }
  for (const pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + pipeGap)
    ) {
      endGame();
    }
    if (bird.x > pipe.x + pipeWidth && !pipe.passed) {
      pipe.passed = true;
      score++;
    }
  }
}

function drawScore() {
  ctx.font = '30px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText('Score: ' + score, 10, 30);
}

function endGame() {
  alert('Game Over! Your score: ' + score);
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  updateBird();
  drawBird();
  updateEnemyBirds();
  drawEnemyBirds();
  updatePipes();
  drawPipes();
  checkCollision();
  drawScore();
  updatePipeSpeed();
  
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleJump);
gameLoop();
