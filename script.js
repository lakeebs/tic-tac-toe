// Game board
function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    // Create 3 empty arrays
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      // Put 3 cells in each empty array
      board[i].push(cell());
    }
  }
  // Return the current state of the board
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
  return { getBoard, addMark, printBoard };
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

  // Set the scores (DOM side)
  // const playerOneScore = document.querySelector('#scorebox .player-one');
  // const playerTwoScore = document.querySelector('#scorebox .player-two');

  // playerOneScore.textContent = players[0].score;
  // playerTwoScore.textContent = players[1].score;

  // Set active player to player 1
  let activePlayer = players[0];

  // Switch turns
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  // Update board after each turn
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
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
      getActivePlayer().score++;
      gameOver();
      return;
    }
    
    if (isFullBoard && !(rowsMatching || columnsMatching || diagonalsMatching())) {
      console.log(`It's a draw!`);
      gameOver();
      return;
    }

    // Game over
    function gameOver() {
      console.log(`Game over! The score is now: ` + players[0].score + ` | ` + players[1].score);
      reset();
    }

    // Reset
    const reset = () => {
      board.getBoard().forEach(row => {
        row.forEach(cell => {
          cell.addValue(' '); // Clear cell value
        });
      });
      printNewRound(); // Print new round
    };

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    reset
  };

}

// Reset the game
const resetGame = () => {
  game.reset();
};

// Start the game
const game = gameController();

/* 

Welcome to Tic Tac Toe! 
Use game.playRound(row, column) to add a mark to the board. 
First to get three-in-a-row wins! 

*/