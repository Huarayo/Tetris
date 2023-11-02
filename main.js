import './style.css'
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS } from './consts' 

// const audio = new audio('./Tetris.mp3')
// audio.volume = 0.5
// audio.play()

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')

let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)


//3. BOARD

const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],

]

// 4. PIEZA PLAYER

const piece = {
  position: { x: 5, y: 5},
  shape: [
    [1, 1],
    [1, 1]
  ]
}

//9. RANDOM PIECES

const PEICES = [
  [
    [1, 1],
    [1, 1]
  ],[
    [1, 1, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ]

]

// 2 . GAME LOOP
let dropCounter = 0
let saveDropCounter = 0
let lastTime = 0
function update(time = 0) {//el navegador pasa el tiempo actualpor el requestAnimationFrame nomas
  const deltaTime = time - lastTime //time siempre va a ser mayor
  lastTime = time //toma el tiempo actual para la siguiente llamada

  dropCounter += deltaTime

  saveDropCounter = deltaTime

  if(dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0
    if( checkCollision() ) {
      piece.position.y--
      solidifyPiece()
      removeRow()
    }
  }

  

  draw()
  window.requestAnimationFrame(update)//crea animaciones sincronizadas con la frecuencia de la actualizacion de pantalla

}

function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => { //recorrer filas y columnas
    row.forEach((value, x) => {
      if( value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if( value ) {
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })


}

document.addEventListener('keydown', event => {
  if(!gamePaused) {
    if(event.key === EVENT_MOVEMENTS.LEFT) {
      piece.position.x--
      if (checkCollision()) {
        piece.position.x++;
      }
    }
    if(event.key === EVENT_MOVEMENTS.RIGHT) {
      piece.position.x++
      if(checkCollision()){
        piece.position.x--
      }
    }
    if(event.key === EVENT_MOVEMENTS.DOWN) {
      piece.position.y++
      if(checkCollision()) {
        piece.position.y--
        solidifyPiece()
        removeRow()
      }
    }
    if(event.key === EVENT_MOVEMENTS.UP) {
      const rotate = []
      
      for (let i = 0; i < piece.shape[0].length; i++) {
        const row = []
        for (let j = piece.shape.length - 1;j >= 0; j--) {
          row.push(piece.shape[j][i])
        }
  
        rotate.push(row)
      }
  
      const previousShape = piece.shape
      piece.shape = rotate
      if( checkCollision() ) {
        piece.shape = previousShape
      }
    }

  }

})

function checkCollision () {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return(
        value !== 0 &&
        board[y + piece.position.y]?.[x+ piece.position.x] !== 0
      )
    })
  })  
}

function solidifyPiece () {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if( value === 1 ) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    })
  })

  let shaperandom = Math.floor(Math.random() * PEICES.length)
  //get random shape
  piece.shape = PEICES[shaperandom]
  //reset position
  piece.position.x = Math.floor(BOARD_WIDTH /2 - 2)
  piece.position.y = 0;
  // gameover
  if( checkCollision() ) {
    window.alert('Game over!!! Sorry!')
    board.forEach((row) => row.fill(0))
  }

}

function removeRow() {
  const rowsToRemove = []

  board.forEach((row, y) => {
    //si todos los elementos cumple esa condicion
    if (row.every(value => value === 1)){
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach((y) => {
    //array.splice(start, deleteCount, item1, item2, ...)
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  })
  $score.innerText = score

  
}

const $button = document.querySelector('.start')

const audio = new window.Audio('./Tetris.mp3')
audio.volume = 0.5
let isPlaying = true
let gamePaused = false

$button.addEventListener('click', () => {
  update()
  
  if(isPlaying) {
    $button.innerText = 'Pause'
    audio.play()
    isPlaying = false
    dropCounter = saveDropCounter
    gamePaused = false
  } else if (!isPlaying){
    $button.innerText = 'Restart Game'
    audio.pause()
    isPlaying = true
    window.cancelAnimationFrame(update(0))
    dropCounter = -100000000
    gamePaused = true
  }


})



let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  // Registra las coordenadas del inicio del toque
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
  // Registra las coordenadas del movimiento del toque
  touchEndX = e.touches[0].clientX;
  touchEndY = e.touches[0].clientY;

  // Calcula la diferencia en coordenadas para determinar la dirección del desplazamiento
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Movimiento horizontal (izquierda o derecha)
    if (deltaX > 10) { // Puedes ajustar el valor para determinar la sensibilidad del movimiento
      // Mover pieza hacia la derecha
      piece.position.x++
      if(checkCollision()){
        piece.position.x--
      }
    } else if (deltaX < -10) {
      // Mover pieza hacia la izquierda
      piece.position.x--
      if(checkCollision()) {
        piece.position.x++
      }
    }
  } else {
    // Movimiento vertical (arriba o abajo)
    if (deltaY > 0) {
      piece.position.y++
      if(checkCollision()) {
        piece.position.y--
        solidifyPiece()
        removeRow()
      }
    }
  }

  // Actualiza las coordenadas de inicio para el siguiente movimiento
  touchStartX = touchEndX;
  touchStartY = touchEndY;
});


const $girar = document.querySelector('.girar')

$girar.addEventListener('click',() => {
  const rotate = []
      
  for (let i = 0; i < piece.shape[0].length; i++) {
    const row = []
    for (let j = piece.shape.length - 1;j >= 0; j--) {
      row.push(piece.shape[j][i])
    }

    rotate.push(row)
  }

  const previousShape = piece.shape
  piece.shape = rotate
  if( checkCollision() ) {
    piece.shape = previousShape
  }
})

