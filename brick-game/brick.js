
import { Player } from './brick.player.js';
import { Ball } from './brick.ball.js';
import { Block } from './brick.block.js';
import { PowerUp, applyPowerUp } from './brick.powerup.js';

const canvas = document.getElementById("board");
const context = canvas.getContext("2d");

const boardWidth = 500;
const boardHeight = 500;
canvas.width = boardWidth;
canvas.height = boardHeight;

// Initialize Player
const player = new Player(boardWidth / 2 - 40, boardHeight - 15, 80, 10, 5);

// Initialize Balls
const balls = [new Ball(boardWidth / 2, boardHeight / 2, 10, 10, 4, 4)];

// Initialize Blocks
const blockArray = [];
const blockColumns = 8;
let blockRows = 3;
const blockMaxRows = 10;
let blockCount = 0;

// Initialize Power-Ups
const powerUps = [];
const powerUpImages = {
    long: new Image(),
    slow: new Image(),
    triple: new Image()
};
powerUpImages.long.src = './img/long.png';
powerUpImages.slow.src = './img/slow.png';
powerUpImages.triple.src = './img/triple.png';

let score = 0;
let gameOver = false;

const paddleImage = new Image();
paddleImage.src = './img/paddle.png'; // Replace with the path to your image

// Load sounds
const paddleHitSound = new Audio('./sounds/pad.mp3');
const brickBreakSound = new Audio('./sounds/break.mp3');
const gameOverSound = new Audio('./sounds/over.mp3');
const powerUpSound = new Audio('./sounds/powerup.mp3');

function playSound(audio) {
    const soundClone = audio.cloneNode();
    soundClone.play();
}

function update() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    context.clearRect(0, 0, boardWidth, boardHeight);

    movePlayer();
    moveBalls();
    movePowerUps();
    drawPlayer();
    drawBalls();
    drawBlocks();
    drawPowerUps();
    checkCollisions();

    requestAnimationFrame(update);
}

function keyDownHandler(e) {
    if (gameOver) {
        if (e.code === "Space") {
            resetGame();
        }
        return;
    }

    if (e.code === "ArrowLeft") {
        player.direction = -1;
    } else if (e.code === "ArrowRight") {
        player.direction = 1;
    }
}

function keyUpHandler(e) {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        player.direction = 0;
    }
}

function movePlayer() {
    player.x += player.direction * player.velocityX;

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > boardWidth) {
        player.x = boardWidth - player.width;
    }
}

function moveBalls() {
    balls.forEach(ball => {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
            ball.velocityY *= -1;
        }

        if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
            ball.velocityX *= -1;
        }

        // Remove ball if it falls below the paddle
        if (ball.y + ball.height >= boardHeight) {
            balls.splice(balls.indexOf(ball), 1);

            // End game if no balls are left
            if (balls.length === 0) {
                gameOver = true;
            }
        }
    });
}

function movePowerUps() {
    powerUps.forEach(powerUp => {
        powerUp.y += powerUp.velocityY;

        if (powerUp.y > boardHeight) {
            powerUps.splice(powerUps.indexOf(powerUp), 1);
        }
    });
}

function drawPlayer() {
    context.drawImage(paddleImage, player.x, player.y, player.width, player.height);
}

function drawBalls() {
    balls.forEach(ball => {
        context.fillStyle = "white";
        context.fillRect(ball.x, ball.y, ball.width, ball.height);
    });
}

function drawBlocks() {
    blockArray.forEach(block => {
        if (!block.break) {
            context.drawImage(block.image, block.x, block.y, block.width, block.height);
        }
    });
}

function drawPowerUps() {
    powerUps.forEach(powerUp => {
        context.drawImage(powerUp.image, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });
}

function checkCollisions() {
    balls.forEach(ball => {
        if (topCollision(ball, player) || bottomCollision(ball, player)) {
            ball.velocityY *= -1;
            playSound(paddleHitSound);
        } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
            ball.velocityX *= -1;
            playSound(paddleHitSound);
        }

        blockArray.forEach(block => {
            if (!block.break) {
                if (topCollision(ball, block) || bottomCollision(ball, block)) {
                    block.break = true;
                    ball.velocityY *= -1;
                    score += 100;
                    blockCount--;
                    playSound(brickBreakSound);
                    if (blockCount % 5 === 0) {
                        createPowerUp(block.x + block.width / 2, block.y);
                    }
                } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                    block.break = true;
                    ball.velocityX *= -1;
                    score += 100;
                    blockCount--;
                    playSound(brickBreakSound);
                    if (blockCount % 5 === 0) {
                        createPowerUp(block.x + block.width / 2, block.y);
                    }
                }
            }
        });

        powerUps.forEach(powerUp => {
            if (topCollision(powerUp, player) || bottomCollision(powerUp, player)) {
                applyPowerUp(powerUp, player, balls, {});
                powerUps.splice(powerUps.indexOf(powerUp), 1);
                playSound(powerUpSound);
            }
        });

        if (blockCount === 0) {
            blockRows = Math.min(blockRows + 1, blockMaxRows);
            createBlocks();
        }
    });

    context.font = "20px sans-serif";
    context.fillStyle = "white";
    context.fillText(`Score: ${score}`, 10, 25);
}

function createPowerUp(x, y) {
    const powerUpTypes = ["long", "slow", "triple"];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    const powerUp = new PowerUp(x, y, type, powerUpImages);
    powerUps.push(powerUp);
}

function topCollision(a, b) {
    return a.y + a.height >= b.y && a.y <= b.y + b.height && a.x + a.width >= b.x && a.x <= b.x + b.width;
}

function bottomCollision(a, b) {
    return a.y <= b.y + b.height && a.y + a.height >= b.y && a.x + a.width >= b.x && a.x <= b.x + b.width;
}

function leftCollision(a, b) {
    return a.x + a.width >= b.x && a.x <= b.x + b.width && a.y + a.height >= b.y && a.y <= b.y + b.height;
}

function rightCollision(a, b) {
    return a.x <= b.x + b.width && a.x + a.width >= b.x && a.y + a.height >= b.y && a.y <= b.y + b.height;
}

function createBlocks() {
    blockArray.length = 0; // Clear the array
    blockCount = 0;
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            const block = new Block(
                15 + c * 60,
                45 + r * 20,
                50,
                10,
                false,
                `./img/${(c + r) % 10 + 1}tile.png`
            );
            blockArray.push(block);
            blockCount++;
        }
    }
}

function drawGameOver() {
    context.font = "40px sans-serif";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText("Game Over", boardWidth / 2, boardHeight / 2);
    context.font = "20px sans-serif";
    context.fillStyle = "white";
    context.fillText("Press Space to Retry", boardWidth / 2, boardHeight / 2 + 40);
    playSound(gameOverSound);
}

function resetGame() {
    player.reset(boardWidth / 2 - 40, boardHeight - 15);
    balls.length = 0;
    balls.push(new Ball(boardWidth / 2, boardHeight / 2, 10, 10, 4, 4));
    
    score = 0;
    powerUps.length = 0;
    blockCount = 0;
    blockRows = 3;
    createBlocks();

    gameOver = false;
    update();
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

window.onload = function() {
    createBlocks();
    update();
};
generateNavbar();