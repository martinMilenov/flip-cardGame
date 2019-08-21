const cards = document.querySelectorAll('.card');
const timer = document.querySelector('.timer');
const game = document.querySelector('.playground');
const lose = document.querySelector('.gameEnd');
const win = document.querySelector('.winGame');
const score = document.querySelector('.score');
const startBtn = document.querySelector('.start-btn');
const scoreWindow = document.querySelector('.score-window');
const resetBtn = document.querySelector('.reset');

let mostRecentScore = localStorage.getItem('highScore');
score.innerHTML = mostRecentScore;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let flipCounter = 0;
let scoreCount = 0;
let interval;
let timeout;

// Start the game!
function startGame() {
  startBtn.style.display = 'none';
  game.style.display = 'flex';
  timer.style.display = 'block';
  resetBtn.style.display = 'block';
  scoreWindow.style.display = 'block';
  timeSolve();
  scoring();
}

// Flip the card
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add('visible');
  timer.classList.add('active');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
  } else {
    // second click
    hasFlippedCard = false;
    secondCard = this;
    checkForMatch();
  }
}

// Checking for match
function checkForMatch() {
  // do cards match?
  if (firstCard.dataset.image === secondCard.dataset.image) {
    scoreCount += 20;
    score.innerHTML = scoreCount;
    localStorage.setItem('highScore', scoreCount);

    // it's a match!
    disableCards();
    winGame();
  } else {
    unflipCards();
  }
}

// disable  the cards if it's not a match
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
}

// Unflip if there's no match
function unflipCards() {
  lockBoard = true;
  // not a match
  setTimeout(() => {
    firstCard.classList.remove('visible');
    secondCard.classList.remove('visible');

    lockBoard = false;
  }, 1000);
}

// shuffle the cards
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 18);
    card.style.order = randomPos;
  });
})();

// Time to solve the game
function timeSolve() {
  timeout = setTimeout(() => {
    gameOver();
  }, 60000);
}

// GameOver display
function gameOver() {
  game.classList.add('loser');
  lose.style.display = 'block';
  game.style.display = 'none';
  clearInterval(interval);
  clearTimeout(timeout);
}

//Winner display
function winGame() {
  if (firstCard.dataset.image === secondCard.dataset.image) {
    flipCounter += 2;
  }
  if (flipCounter === cards.length) {
    game.classList.add('loser');
    game.style.display = 'none';
    win.style.display = 'block';
    timer.style.display = 'none';
    clearInterval(interval);
    clearTimeout(timeout);
  }
}

//Scoring function
function scoring() {
  interval = setInterval(() => {
    scoreCount -= 10;
    score.innerHTML = scoreCount;
  }, 10000);
}

cards.forEach(card => card.addEventListener('click', flipCard));
startBtn.addEventListener('click', startGame);
