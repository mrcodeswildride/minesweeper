let squares = document.getElementsByClassName(`square`)
let minesLeftParagraph = document.getElementById(`minesLeftParagraph`)
let messageParagraph = document.getElementById(`messageParagraph`)
let playAgainButton = document.getElementById(`playAgainButton`)

let numMines = 10
let numFlags = 0
let squareClicked = false
let gameOver = false

for (let square of squares) {
  square.addEventListener(`mousedown`, clickSquare)
  square.addEventListener(`contextmenu`, disableContextMenu)
}

playAgainButton.addEventListener(`click`, playAgain)

function clickSquare(event) {
  if (!squareClicked) {
    randomSetup(this)
    squareClicked = true
  }

  if (!this.classList.contains(`selected`) && !gameOver) {
    if (event.buttons == 1 && !this.classList.contains(`flag`)) {
      if (!this.classList.contains(`mine`)) {
        selectSquare(this)
        checkWin()
      }
      else {
        hitMine()
      }
    }
    else if (event.buttons == 2) {
      toggleFlag(this)
    }
  }
}

function randomSetup(clickedSquare) {
  let squareNumbers = []

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] != clickedSquare) {
      squareNumbers.push(i)
    }
  }

  for (let i = 0; i < squareNumbers.length * 10; i++) {
    let randomNumber1 = Math.floor(Math.random() * squareNumbers.length)
    let randomNumber2 = Math.floor(Math.random() * squareNumbers.length)

    let temp = squareNumbers[randomNumber1]
    squareNumbers[randomNumber1] = squareNumbers[randomNumber2]
    squareNumbers[randomNumber2] = temp
  }

  for (let i = 0; i < numMines; i++) {
    let squareNumber = squareNumbers[i]
    squares[squareNumber].classList.add(`mine`)
  }
}

function selectSquare(square) {
  square.classList.add(`selected`)

  let neighbors = [
    getNeighbor(square, -1, -1),
    getNeighbor(square, 0, -1),
    getNeighbor(square, 1, -1),
    getNeighbor(square, -1, 0),
    getNeighbor(square, 1, 0),
    getNeighbor(square, -1, 1),
    getNeighbor(square, 0, 1),
    getNeighbor(square, 1, 1)
  ]

  let mineCount = 0

  for (let neighbor of neighbors) {
    if (neighbor != null && neighbor.classList.contains(`mine`)) {
      mineCount++
    }
  }

  square.classList.add(`mines${mineCount}`)

  if (mineCount == 0) {
    for (let neighbor of neighbors) {
      if (neighbor != null && !neighbor.classList.contains(`selected`) && !neighbor.classList.contains(`flag`)) {
        selectSquare(neighbor)
      }
    }
  }
  else {
    square.innerHTML = mineCount
  }
}

function getNeighbor(square, xDiff, yDiff) {
  // array of rows
  let rows = document.getElementsByClassName(`row`)

  let row = square.parentElement // row of square
  let y // y coordinate of square, set below
  let x // x coordinate of square, set below

  // loop through rows to determine y
  for (let i = 0; i < rows.length; i++) {
    if (rows[i] == row) {
      y = i // found matching row, so set y
    }
  }

  // loop through squares in row to determine x
  for (let i = 0; i < row.children.length; i++) {
    if (row.children[i] == square) {
      x = i // found matching square, so set x
    }
  }

  // row of neighbor square
  let neighborRow = rows[y + yDiff]

  if (neighborRow == null) {
    // row is beyond edge, so no neighbor square
    return null
  }
  else {
    // if x + xDiff is beyond edge, will be null
    return neighborRow.children[x + xDiff]
  }
}

function checkWin() {
  let selectedSquares = document.getElementsByClassName(`selected`)

  if (selectedSquares.length == squares.length - numMines) {
    messageParagraph.innerHTML = `Good job!`
    playAgainButton.style.display = `block`
    gameOver = true
  }
}

function hitMine() {
  messageParagraph.innerHTML = `You lose`
  playAgainButton.style.display = `block`
  gameOver = true

  for (let square of squares) {
    if (square.classList.contains(`mine`) && !square.classList.contains(`flag`)) {
      square.classList.add(`revealed`)
    }
    else if (square.classList.contains(`flag`) && !square.classList.contains(`mine`)) {
      square.classList.add(`flag-x`)
    }
  }
}

function toggleFlag(square) {
  if (!square.classList.contains(`flag`)) {
    numFlags++

  }
  else {
    numFlags--
  }

  square.classList.toggle(`flag`)
  minesLeftParagraph.innerHTML = `Mines Left: ${numMines - numFlags}`
}

function disableContextMenu(event) {
  event.preventDefault()
}

function playAgain() {
  numFlags = 0
  squareClicked = false
  gameOver = false

  for (let square of squares) {
    square.innerHTML = ``
    square.className = `square`
  }

  minesLeftParagraph.innerHTML = `Mines Left: ${numMines}`
  messageParagraph.innerHTML = ``
  playAgainButton.style.display = `none`
}