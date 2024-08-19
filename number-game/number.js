let secretNumber;
let guessCount = 0;
let maxGuesses;
const startButton = document.getElementById('start');
const guessInput = document.getElementById('guess');
const checkButton = document.getElementById('check');
const message = document.getElementById('message');
const levelSelect = document.getElementById('level');
const restartButton = document.getElementById('restart');
startButton.addEventListener('click', startGame);
checkButton.addEventListener('click', checkGuess);
restartButton.addEventListener('click', restartGame);
function startGame() {
  const difficulty = levelSelect.value;
  let max;
  switch (difficulty) {
    case 'easy':
      max = 10;
      maxGuesses = 3;
      break;
    case 'medium':
      max = 50;
      maxGuesses = 5;
      break;
    case 'hard':
      max = 100;
      maxGuesses = 10;
      break;
  }
  guessCount = 0;
  secretNumber = Math.floor(Math.random() * max) + 1;
  guessInput.disabled = false;
  checkButton.disabled = false;
  message.textContent = 'Guess a number between 1 and ' + max;
  startButton.disabled = true;
  restartButton.style.display = 'inline-block';
}
function checkGuess() {
  const guess = parseInt(guessInput.value);
  guessCount++;

  if (guess === secretNumber) {
    showWinScreen();
  } else if (guess < secretNumber) {
    message.textContent = 'Too low! Try again.';
  } else if (guess > secretNumber) {
    message.textContent = 'Too high! Try again.';
  }

  if (guessCount >= maxGuesses && guess !== secretNumber) {
    message.textContent = 'You ran out of guesses! The number was ' + secretNumber;
    checkButton.disabled = true;
  }
}
function resetGame() {
  const winScreen = document.getElementById('win-screen');
  if (winScreen) {
    winScreen.remove();
  }
  startButton.disabled = false;
  guessInput.value = '';
  guessInput.disabled = true;
  checkButton.disabled = true;
  guessCount = 0;
  message.textContent = '';
  restartButton.style.display = 'none';
}
function restartGame() {
  resetGame();
  startGame();
}

function showWinScreen() {
  const winScreen = document.createElement('div');
  winScreen.id = 'win-screen';
  winScreen.style.display = 'flex';
  winScreen.style.position = 'fixed';
  winScreen.style.top = '0';
  winScreen.style.left = '0';
  winScreen.style.width = '100%';
  winScreen.style.height = '100%';
  winScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  winScreen.style.alignItems = 'center';
  winScreen.style.justifyContent = 'center';
  const content = document.createElement('div');
  content.className = 'content';
  content.style.backgroundColor = '#fff';
  content.style.padding = '30px';
  content.style.borderRadius = '10px';
  content.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
  content.style.textAlign = 'center';
  const message = document.createElement('h2');
  message.style.color = '#4CAF50';
  message.style.marginBottom = '20px';
  message.textContent = 'Congratulations! You Win!';
  const image = document.createElement('img');
  image.src = 'https://png.pngtree.com/png-clipart/20220605/original/pngtree-congratulation-teks-for-graduate-png-image_7948413.png';
  image.alt = 'Winning Trophy';
  image.style.width = '100px';
  image.style.height = '100px';
  const playAgainButton = document.createElement('button');
  playAgainButton.textContent = 'Play Again';
  playAgainButton.style.backgroundColor = '#f44336';
  playAgainButton.style.color = 'white';
  playAgainButton.addEventListener('click', resetGame);
content.appendChild(message);
  content.appendChild(image);
  content.appendChild(playAgainButton);
  winScreen.appendChild(content);
  document.body.appendChild(winScreen);
}
