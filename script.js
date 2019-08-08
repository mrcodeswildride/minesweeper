var rows = document.querySelectorAll(".row");
var squares = document.querySelectorAll(".row div");
var minesLeftDisplay = document.getElementById("minesLeft");
var restartButton = document.getElementById("restart");
var messageDisplay = document.getElementById("message");

var numMines = 10;
var numFlags = 0;
var gameInProgress = true;
var squareClicked = false;

for (var i = 0; i < squares.length; i++) {
    squares[i].addEventListener("mousedown", clickSquare);
    squares[i].addEventListener("contextmenu", function() {
        event.preventDefault();
    });
}

restartButton.addEventListener("click", restart);

function clickSquare(event) {
    if (gameInProgress && !squareClicked) {
        squareClicked = true;
        randomSetup(this);
    }

    if (gameInProgress && !this.classList.contains("selected")) {
        if (event.buttons == 1 && !this.classList.contains("flag")) {
            if (this.classList.contains("mine")) {
                gameInProgress = false;
                messageDisplay.innerHTML = "You lose";

                for (var i = 0; i < squares.length; i++) {
                    if (squares[i].classList.contains("mine") && !squares[i].classList.contains("flag")) {
                        squares[i].classList.add("mine-revealed");
                    }
                    else if (squares[i].classList.contains("flag") && !squares[i].classList.contains("mine")) {
                        squares[i].classList.add("flag-x");
                    }
                }
            }
            else {
                selectSquare(this);
                checkWin();
            }
        }
        else if (event.buttons == 2) {
            if (this.classList.contains("flag")) {
                numFlags--;

            }
            else {
                numFlags++;
            }

            minesLeftDisplay.innerHTML = "Mines Left: " + (numMines - numFlags);
            this.classList.toggle("flag");
        }
    }
}

function randomSetup(square) {
    var squareNumbers = [];

    for (var i = 0; i < squares.length; i++) {
        if (squares[i] != square) {
            squareNumbers.push(i);
        }
    }

    for (var i = 0; i < squareNumbers.length * 10; i++) {
        var randomNumber1 = Math.floor(Math.random() * squareNumbers.length);
        var randomNumber2 = Math.floor(Math.random() * squareNumbers.length);

        var temp = squareNumbers[randomNumber2];
        squareNumbers[randomNumber2] = squareNumbers[randomNumber1];
        squareNumbers[randomNumber1] = temp;
    }

    for (var i = 0; i < numMines; i++) {
        var squareNumber = squareNumbers[i];
        squares[squareNumber].classList.add("mine");
    }
}

function selectSquare(square) {
    square.classList.add("selected");

    var neighbors = [
        getNeighbor(square, -1, 0),
        getNeighbor(square, -1, -1),
        getNeighbor(square, 0, -1),
        getNeighbor(square, 1, -1),
        getNeighbor(square, 1, 0),
        getNeighbor(square, 1, 1),
        getNeighbor(square, 0, 1),
        getNeighbor(square, -1, 1)
    ];

    var mineCount = 0;

    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i] && neighbors[i].classList.contains("mine")) {
            mineCount++;
        }
    }

    square.classList.add("mines" + mineCount);

    if (mineCount == 0) {
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i] && !neighbors[i].classList.contains("selected") && !neighbors[i].classList.contains("flag")) {
                selectSquare(neighbors[i]);
            }
        }
    }
    else {
        square.innerHTML = mineCount;
    }
}

function getNeighbor(square, xDiff, yDiff) {
    var x = parseInt(square.getAttribute("index"), 10);
    var y = parseInt(square.parentElement.getAttribute("index"), 10);

    var row = rows[y + yDiff];
    var neighbor = null;

    if (row) {
        neighbor = row.children[x + xDiff];
    }

    return neighbor;
}

function checkWin() {
    var selectedSquares = document.querySelectorAll(".selected");

    if (selectedSquares.length == squares.length - numMines) {
        gameInProgress = false;
        messageDisplay.innerHTML = "Good job!";
    }
}

function restart() {
    numFlags = 0;
    gameInProgress = true;
    squareClicked = false;

    minesLeftDisplay.innerHTML = "Mines Left: " + numMines;
    messageDisplay.innerHTML = "";

    for (var i = 0; i < squares.length; i++) {
        squares[i].innerHTML = "";
        squares[i].className = "";
    }
}
