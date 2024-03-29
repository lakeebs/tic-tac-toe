// Game board
function gameBoard() {
  const grid = 4;
  const board = [];

  for (let i = 0; i < grid; i++) {
    // Create x empty arrays
    board[i] = [];
    for (let j = 0; j < grid; j++) {
      // Put x cells in each empty array
      board[i].push(cell());
    }
  }
  // Get the current state of the board
  const getBoard = () => board;

  // Add mark ('player' is the value (i.e. 1, 2))
  const addMark = (row, column, player) => {
    if (!(board[row][column].getValue() == ' ')) {
      return;
    } else {
      board[row][column].addValue(player);
    }
  };

  // Print the board
  const printBoard = () => {

    // Map each row, then get the value of each cell in each row
    const cellValues = board.map(row => row.map(cell => cell.getValue()))
    console.log(cellValues);

  };
  return { getBoard, addMark, printBoard, grid };
}

// Cell 
function cell() {
  let value = ' ';

  const addValue = (player) => { // 'player' is the value (i.e. 1, 2)
    value = player;
  };

  const getValue = () => value;
  return { addValue, getValue };
}

// Game controller
function gameController() {

  // Set the board
  const board = gameBoard();

  // Game status
  let isGameOver = false;

  // Set the players
  const players = [
    {
      name: 'Player One',
      value: '×',
      score: 0
    },
    {
      name: 'Player Two',
      value: '○',
      score: 0
    }
  ];

  // Set active player to player 1
  let activePlayer = players[0];

  // Set the scores
  const playerOneScore = document.querySelector('#scorebox .player-one .score');
  const playerTwoScore = document.querySelector('#scorebox .player-two .score');

  playerOneScore.textContent = players[0].score;
  playerTwoScore.textContent = players[1].score;

  // Switch turns
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  // Update board after each turn
  const printNewRound = () => {
    board.printBoard();

    if (isGameOver == false) {
      console.log(`${getActivePlayer().name}'s turn`);
    }
  };

  // Play round
  const playRound = (row, column) => {
    board.addMark(row, column, getActivePlayer().value);

    // Check winner
    const rowsMatching = board.getBoard().some(row => row.every(cell => cell.getValue() === getActivePlayer().value));

    const columnsMatching = board.getBoard().every(row => row[column].getValue() === getActivePlayer().value);

    const diagonalsMatching = () => {
      // Check main diagonal from top-left to bottom-right
      const mainDiagonal = board.getBoard().map((row, index) => row[index].getValue());
      if (mainDiagonal.every(value => value === getActivePlayer().value)) {
        return true;
      }
  
      // Check secondary diagonal from top-right to bottom-left
      const secondaryDiagonal = board.getBoard().map((row, index) => row[board.getBoard().length - 1 - index].getValue());
      if (secondaryDiagonal.every(value => value === getActivePlayer().value)) {
        return true;
      }
  
      return false;
    };

    const isFullBoard = board.getBoard().every(row => row.every(cell => cell.getValue() !== ' '));

    if (rowsMatching || columnsMatching || diagonalsMatching()) {
      board.printBoard();
      console.log(`${getActivePlayer().name} wins!`);
      document.querySelector('.game-over').style.display = 'block';
      document.querySelector('.game-over').textContent = `${getActivePlayer().name} wins!`

      if (getActivePlayer().name == 'Player One') {
        playerOneScore.textContent = ++getActivePlayer().score;
      }

      if (getActivePlayer().name == 'Player Two') {
        playerTwoScore.textContent = ++getActivePlayer().score;
      }
      
      gameOver();
    }
    
    if (isFullBoard && !(rowsMatching || columnsMatching || diagonalsMatching())) {
      console.log(`It's a draw!`);
      document.querySelector('.game-over').style.display = 'block';
      document.querySelector('.game-over').textContent = `It's a draw!`
      gameOver();
    }

    if (isGameOver == false) {
      switchPlayerTurn();
      printNewRound();
    }

  }; // End Play Round

  printNewRound();

  // Game over
  const resetBtn = document.querySelector('#messages .reset');
  function gameOver() {
    console.log(`Game over! The score is now: ` + players[0].score + ` | ` + players[1].score);
    isGameOver = true;
    document.querySelector('.turn').style.display = 'none';

    // Reset button
    resetBtn.style.display = 'block';
    resetBtn.addEventListener('click', () => reset());
  }

  // Reset
  const reset = () => {
    board.getBoard().forEach(row => {
      row.forEach(cell => {
        cell.addValue(' ');
      });
    });
    resetBtn.style.display = 'none';
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.turn').style.display = 'block';
    document.querySelectorAll('#board button').forEach(button => { button.textContent = ' ' });
    activePlayer = players[0];
    document.querySelector('.turn').textContent = `${activePlayer.name}'s turn`;
    isGameOver = false;
    printNewRound();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getIsGameOver: () => isGameOver
  };
} // End Game Controller

function screenController() {

  const game = gameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('#board');
  const board = game.getBoard();
  const grid = gameBoard().grid;

  const updateScreen = () => {
    // Clear the board
    boardDiv.textContent = ' ';

    // Get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn`
    
    // Render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');
        cellButton.dataset.column = columnIndex;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
        boardDiv.style.gridTemplateColumns = 'repeat(' + grid + ', 1fr)';
      })
    })
  }

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    
    if (!(selectedRow || selectedColumn) || game.getIsGameOver() == true || !isCellEmpty(selectedRow, selectedColumn)) return;
    
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener('click', clickHandlerBoard);

  function isCellEmpty(row, column) {
    if (board[row][column].getValue() == ' ') {
      return true;
    }
  }

  // Initial render
  updateScreen();
}

screenController();