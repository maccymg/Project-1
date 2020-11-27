

function init() {

  // * DOM Elements

  const grid = document.querySelector('.grid')
  const gridWrapper = document.querySelector('.grid-wrapper')
  const startBtn = document.querySelector('#start')
  const scoreDisplay = document.querySelector('#score')
  const highScoreDisplay = document.querySelector('#high-score')
  const audio = document.getElementById('audio')
  const audioTwo = document.getElementById('audio-two')
  const classicBtn = document.querySelector('.classic')
  const neonBtn = document.querySelector('.neon')
  const moonBtn = document.querySelector('.moon')
  const leftSection = document.querySelector('section:first-child')
  const rightSection = document.querySelector('section:last-child')
  const bAudio = document.querySelector('#switch')


  // * Variables

  const width = 20
  const cellCount = width * width
  const cells = []
  const snake = 'snake'
  const foodClass = 'food'
  const eyesUp = 'eyes-up'
  const eyesAlong = 'eyes-along'
  let foodPosition = 0
  let snakePosition = [208, 209, 210, 211]
  let eyePosition = 0
  let currentDirection = 'left'
  let timerId = null
  let timerTwoId = null
  let score = 0
  let time = 300
  let isPlaying = false
  

  // * Building the grid

  function createGrid(snakePosition) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      // cell.textContent = i
      grid.appendChild(cell)
      cells.push(cell)
    }
    addSnakeClass(snakePosition)
    generateRandomFoodPosition()
    addFood(foodPosition)
    generateEyePosition()
    addSnakeEyesAlong(eyePosition)
  }


  // * Functions


  // * Color Functions

  function classicGameColor() {
    gridWrapper.style.background = 'rgba(0, 255, 42, 0.74)'
    leftSection.style.background = 'orange'
    rightSection.style.background = 'orange'
  }

  function neonGameColor() {
    gridWrapper.style.background = 'rgb(255, 0, 191)'
    leftSection.style.background = 'yellow'
    rightSection.style.background = 'yellow'
  }

  function moonGameColor() {
    gridWrapper.style.background = 'black'
    leftSection.style.background = 'white'
    rightSection.style.background = 'white'
  }

  // * Snake Classes

  function addSnakeClass(positionArray) {
    positionArray.forEach(position => {
      cells[position].classList.add(snake)
    })
  }

  function removeSnakeClass(positionArray) {
    positionArray.forEach(position => {
      cells[position].classList.remove(snake)
    })
  }

  // * Eye Classes + Functions

  function addSnakeEyesAlong(position) {
    cells[position].classList.add(eyesAlong)
  }

  function removeSnakeEyesAlong(position) {
    cells[position].classList.remove(eyesAlong)
  }

  function addSnakeEyesUp(position) {
    cells[position].classList.add(eyesUp)
  }

  function removeSnakeEyesUp(position) {
    cells[position].classList.remove(eyesUp)
  }

  function generateEyePosition() {
    eyePosition = snakePosition[0]
  }

  function moveEyesAlong() {
    removeSnakeEyesUp(eyePosition)
    removeSnakeEyesAlong(eyePosition)
    generateEyePosition()
    addSnakeEyesAlong(eyePosition)
  }

  function moveEyesUp() {
    removeSnakeEyesAlong(eyePosition)
    removeSnakeEyesUp(eyePosition)
    generateEyePosition()
    addSnakeEyesUp(eyePosition)
  }

  function eyesMain() {
    if (currentDirection === 'left') {
      moveEyesAlong()
    } else if (currentDirection === 'right') {
      moveEyesAlong()
    } else if (currentDirection === 'up') {
      moveEyesUp()
    } else {
      moveEyesUp()
    }
  }

  // * Food Functions

  function addFood(position) {
    cells[position].classList.add(foodClass)
  }

  function removeFood(position) {
    cells[position].classList.remove(foodClass)
  }

  function generateRandomFoodPosition() {
    const randomCell = Math.floor(Math.random() * cellCount)
    if (snakePosition.includes(randomCell)) generateRandomFoodPosition()
    else foodPosition = randomCell
  }

  function eatFood() {
    if (foodPosition === snakePosition[0]) {
      playCrunchAudio()
      removeFood(foodPosition)
      generateRandomFoodPosition()
      addFood(foodPosition)
    }
  }
  
  // * Update Score

  function updateScore() {
    scoreDisplay.innerHTML = score
    score = snakePosition.length - 4
  }

  function updateHighScore() {
    if (score > highScoreDisplay.innerHTML) {
      highScoreDisplay.innerHTML = score
    }
  }

  // * UpdateTime

  function updateTime(startTimer, timerId) {
    if (score < 5) {
      time = 300
    } else if (score < 10) {
      clearTimeout(timerId)
      time = 250
      startTimer()
    } else if (score < 25) {
      clearTimeout(timerId)
      time = 225
      startTimer()
    } else if (score < 50) {
      clearTimeout(timerId)
      time = 200
      startTimer()
    } else if (score < 80) {
      clearTimeout(timerId)
      time = 175
      startTimer()
    } else {
      clearTimeout(timerId)
      time = 150
      startTimer()
    }
  }

  //* Audio Functions

  function playBumpAudio() {
    audio.src = './audio/483602__raclure__game-bump.mp3'
    audio.play()
  }

  function playCrunchAudio() {
    audio.src = './audio/20268__koops__apple-crunch-05.wav'
    audio.play()
  }

  function playBackgroundAudio() {
    let seconds = 0
    
    timerTwoId = setInterval(function play() {
      audioTwo.src = './audio/352830__troym1__snake-in-da-grass.wav'
      audioTwo.play()
      seconds ++
      console.log(seconds)
    }, 23000)
  }

  function playOrPause() {
    if (isPlaying === true) {
      audioTwo.pause()
      clearTimeout(timerTwoId)
      isPlaying = false
    } else {
      isPlaying = true
      playBackgroundAudio()
    }
  }

  //* Key Movements

  function handleKeyUp(event) {

    switch (event.keyCode) {
      case 39: //arrow right
        if (currentDirection !== 'left') {
          currentDirection = 'right'
        }
        break
      case 37: //arrow left
        if (currentDirection !== 'right') {
          currentDirection = 'left'
        }
        break
      case 38: //arrow up
        if (currentDirection !== 'down') {
          currentDirection = 'up'
        }
        break
      case 40: //arrow down
        if (currentDirection !== 'up') {
          currentDirection = 'down'
        }
        break
    }
  }

  //* Stop arrow Scrolling

  window.addEventListener('keydown', function(e) {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault()
    }
  }, false)


  //* Move Snake

  function moveSnake(head) {

    let horizontalPosition = snakePosition[0] % width
    let verticalPosition = Math.floor(snakePosition[0] / width)

    switch (head) {
      case 'right': 
        if (horizontalPosition < width - 1) {
          if (snakePosition.includes(snakePosition[0] + 1)) resetGame()
          snakePosition.unshift(snakePosition[0] + 1)
          if (snakePosition[0] === foodPosition) eatFood()
          else snakePosition.pop()
        } else { 
          resetGame()
        }
        break
      case 'left': 
        if (horizontalPosition > 0) {
          if (snakePosition.includes(snakePosition[0] - 1)) resetGame()
          snakePosition.unshift(snakePosition[0] - 1)
          if (snakePosition[0] === foodPosition) eatFood()
          else snakePosition.pop()
        } else { 
          resetGame()
        }
        break
      case 'up': 
        if (verticalPosition > 0) {
          if (snakePosition.includes(snakePosition[0] - width)) resetGame()
          snakePosition.unshift(snakePosition[0] -= width)
          snakePosition[1] = (snakePosition[1] += width)
          if (snakePosition[0] === foodPosition) eatFood()
          else snakePosition.pop()
        } else { 
          resetGame()
        }
        break
      case 'down': 
        if (verticalPosition < width - 1) {
          if (snakePosition.includes(snakePosition[0] + width)) resetGame()
          snakePosition.unshift(snakePosition[0] += width)
          snakePosition[1] = (snakePosition[1] -= width)
          if (snakePosition[0] === foodPosition) eatFood()
          else snakePosition.pop()
        } else {
          resetGame()
        }
        break
    } 
  }

  //* Game Function/ Timer

  function startTimer() {
    let count = 0

    timerId = setInterval(() => {
      count ++
      removeSnakeClass(snakePosition)
      moveSnake(currentDirection)
      addSnakeClass(snakePosition)
      eyesMain()
      eatFood()
      updateScore()
      updateHighScore()
      updateTime(startTimer, timerId)
      console.log(snakePosition)
    }, time)

    startBtn.removeEventListener('click', startTimer)
  }


  //* Reset Game

  function resetGame() {
    playBumpAudio()
    currentDirection = 'left'
    snakePosition = [208, 209, 210, 211]
    setTimeout(function() { 
      alert((`Well played, your score was: ${scoreDisplay.innerHTML}`))
    }, 1000)
    setTimeout(function() { 
      score = 0
    }, 3000)
    time = 300
    removeFood(foodPosition)
    generateRandomFoodPosition()
    addFood(foodPosition)
    startBtn.addEventListener('click', startTimer)
    clearTimeout(timerId)
  }

  //* Event Listeners
  document.addEventListener('keyup', handleKeyUp)
  createGrid(snakePosition)
  startBtn.addEventListener('click', startTimer)
  classicBtn.addEventListener('click', classicGameColor)
  neonBtn.addEventListener('click', neonGameColor)
  moonBtn.addEventListener('click', moonGameColor)
  bAudio.addEventListener('click', playOrPause)
}

window.addEventListener('DOMContentLoaded', init)