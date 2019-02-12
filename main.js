let size = 20;  // number of squares on a side
let speed = 150;
let score = 0;
let snake = {                // the snake starts with a length of 3
    tail: [1, 2, 3],
    head: function () {
        return this.tail[this.tail.length - 1];
    },
    direction: "right",
    directionChanged: false
}

let icon = '<i class="fas fa-cat"></i>';
let gameStarted;
let food = {
    position: 450
}

// create an empty square gameboard
function createGameBoard() {
    const boardContainer = document.getElementById('board-container');
    const gameBoard = document.createElement('div');
    gameBoard.setAttribute('id', 'game-board');

    for (let i = 1; i <= size * size; i++) {          // create all squares of the gameboard
        const square = document.createElement('div');
        square.setAttribute('id', `${i}`);
        square.classList.add('square-size');
        gameBoard.appendChild(square);
    }
    boardContainer.appendChild(gameBoard);
}

createGameBoard();
const gameBoard = document.getElementById('game-board');


// draw the snake
function drawSnake() {
    const tail = snake.tail;

    for (let i = 0; i < tail.length; i++) {
        const square = document.getElementById(`${tail[i]}`);
        if (!square.classList.contains('snake-piece')) square.classList.add('snake-piece');
    }
}

drawSnake(snake);

// find an empty spot
function findEmptySquares() {
    const snakePositions = snake.tail;
    const squares = Array.from(gameBoard.children);
    let emptySquares = squares.filter(square => !snakePositions.includes(Number(square.id))).map(square => square.id);
    return emptySquares;
}

// create the food
function createFood() {
    let emptySquares = findEmptySquares();
    let randomPosition = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    food.position = randomPosition;
    let foodSquare = document.getElementById(randomPosition);
    foodSquare.innerHTML = icon;
}

// grow the snake when snake eat food

function eatTheFruit(position) {
    if (position == food.position) {
        return true;
    } else return false;
}

// to move the snake to next square if no crash
function move() {
    snake.directionChanged = false;

    let nextHeadPosition = findNextHeadPosition(snake.direction);

    if (checkForCrash(nextHeadPosition)) {
        makeSnakeDisappear();
        clearInterval(gameStarted);
        gameIsOver();
        createRestartButton();

    } else if (eatTheFruit(nextHeadPosition)) {
        document.getElementById(food.position).textContent = '';
        snake.tail.push(nextHeadPosition);
        displayCatsInStomach();
        createFood();

    } else {
        let last = snake.tail.shift();
        document.getElementById(last).classList.remove('snake-piece');
        snake.tail.push(nextHeadPosition);
    }

    drawSnake();
}

// check for crash against walls or itself

function checkForCrash(nextPosition) {
    let direction = snake.direction;
    let position = Number(nextPosition);

    if (snake.tail.includes(position)) {
        return true;

    } else if (position < 0 || position > size * size) {
        return true;

    } else if (direction == 'right' && position % size == 1) {
        return true;

    } else if (direction == 'left' && position % size == 0) {
        return true;

    } else return false;
}

// find the next position depending on the direction
function findNextHeadPosition(direction) {
    switch (direction) {
        case 'right':
            return nextHeadPosition = snake.head() + 1;
            break;
        case 'left':
            return nextHeadPosition = snake.head() - 1;
            break;
        case 'up':
            return nextHeadPosition = snake.head() - size;
            break;
        case 'down':
            return nextHeadPosition = snake.head() + size;
            break;
    }
}

// to move the snake depending on the arrow keys pressed
function changeDirection(e) {
    switch (e.keyCode) {
        case 37:
            if (snake.direction != 'right' && snake.direction != 'left' && !snake.directionChanged) {
                snake.direction = 'left';
                snake.directionChanged = true;
            }
            break;
        case 38:
            if (snake.direction != 'down' && snake.direction != 'up' && !snake.directionChanged) {
                snake.direction = 'up';
                snake.directionChanged = true;
            }
            break;
        case 39:
            if (snake.direction != 'left' && snake.direction != 'right' && !snake.directionChanged) {
                snake.direction = 'right';
                snake.directionChanged = true;
            }
            break;
        case 40:
            if (snake.direction != 'up' && snake.direction != 'down' && !snake.directionChanged) {
                snake.direction = 'down';
                snake.directionChanged = true;
            }
            break;
    }
}

// get the position (x, y) of the cat (when snake crashes);

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

window.addEventListener('keydown', changeDirection, true);

function startGame() {
    createFood();
    gameStarted = setInterval(move, speed);
}

function restart() {

    const boardContainer = document.getElementById('board-container');
    const oldBoard = document.getElementById('game-board');
    boardContainer.removeChild(oldBoard);
    const result = document.getElementById('result');
    result.innerHTML = '';
    const place = document.getElementById('restart');
    place.innerHTML = '';
    createGameBoard();
    startGame();
    snake = {
        tail: [1, 2, 3],
        head: function () {
            return this.tail[this.tail.length - 1];
        },
        direction: "right",
        directionChanged: false
    }
    drawSnake();
}

// display when the game is over

function gameIsOver() {
    let cat = document.getElementById(food.position);
    
    let gameOver = document.createElement('p');
    
    Number(food.position) < size * size/ 5 ? gameOver.classList.add('game-over-bottom') : gameOver.classList.add('game-over-top');
    gameOver.textContent = 'MEOWWW! You lost!';
    cat.appendChild(gameOver);
}

// show how many cats the snake ate

function displayCatsInStomach() {
    let result = document.getElementById('result');
    let stomach = result.innerHTML;
    result.innerHTML = stomach + icon;
}

function makeSnakeDisappear() {
    for (let i = 0; i < snake.tail.length; i++) {
        document.getElementById(snake.tail[i]).style.opacity = '0.4';
    }
}

function createRestartButton() {
    let place = document.getElementById('restart');
    let btn = document.createElement('button');
    btn.classList.add('button');
    btn.textContent = 'Restart';
    btn.onclick = restart;
    place.appendChild(btn);
}


startGame();
