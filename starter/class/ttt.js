const Screen = require("./screen");
const Cursor = require("./cursor");
const ComputerPlayer = require("./computer-player")

class TTT {

  constructor() {

    this.playerTurn = "O";
    this.vsAI = false;
    this.AI;

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);

    // command inititalization
    Screen.addCommand('down', 'Move cursor down one.', this.cursor.down);
    Screen.addCommand('up', 'Move cursor up one.', this.cursor.up);
    Screen.addCommand('left', 'Move cursor left one.', this.cursor.left);
    Screen.addCommand('right', 'Move cursor right one.', this.cursor.right);
    Screen.addCommand('space', 'Place character at current location in grid', this.place);
    Screen.addCommand('a', 'play vs AI', this.createAI);


    this.cursor.setBackgroundColor();
    this.currentPlayer(this.playerTurn);
    Screen.render();
  }

  createAI = () => {
    this.AI = new ComputerPlayer();
    this.vsAI = true;
  }

  computerMove = () => {
    let randomMove = ComputerPlayer.randomMove(this.grid);
    let smartestMove = ComputerPlayer.getSmartMove(this.grid, this.playerTurn);
    console.log(randomMove);
    console.log(smartestMove);

    if (smartestMove !== undefined){
      let row = smartestMove.row;
      let col = smartestMove.col;

      this.grid[row][col] = this.playerTurn;
      Screen.setGrid(row, col, this.playerTurn);
    } else {
      let row = randomMove.row;
      let col = randomMove.col;

      this.grid[row][col] = this.playerTurn;
      Screen.setGrid(row, col, this.playerTurn);
    }

    this.currentPlayer();
    Screen.render();
    TTT.checkWin(this.grid);
  }

  place = () => {
    let row = this.cursor.row;
    let col = this.cursor.col;

    if (this.grid[row][col] === ' '){
      this.grid[row][col] = this.playerTurn;
      Screen.setGrid(row, col, this.playerTurn);
    } else {
      console.log('Invalid move, space is occupied');
      return;
    }
    this.cursor.resetBackgroundColor();
    this.cursor.row = 0;
    this.cursor.col = 0;
    this.cursor.setBackgroundColor();

    this.currentPlayer();
    Screen.render();
    TTT.checkWin(this.grid);
    if (this.vsAI){
      this.computerMove();
    }
  }

  currentPlayer = () => {
    if (this.playerTurn === "O"){
      this.playerTurn = "X";
    } else {
      this.playerTurn = "O";
    }
    Screen.setMessage(`Current player is ${this.playerTurn}`);
  }

  static checkWin(grid) {
    const flatGrid = grid.flat();
    const gridEmpty = flatGrid.every(ele => ele === ' ');
    if (gridEmpty){
      return false;
    }

   let boardNotFull = false;
   let winner = null;

    // check horizontal wins
    for (let row = 0; row < grid.length; row++){
      const currentRow = grid[row];

      // check for winner
      const winnerFound = currentRow.every(ele => ele === currentRow[0]);
      if (winnerFound && 'XO'.includes(currentRow[0])){
        winner = currentRow[0];
      }

      // check if row has empty spaces
      if (!boardNotFull){
        boardNotFull = currentRow.some(ele => ele === ' ');
      }
    }

    // check vertical wins
    for (let col = 0; col < grid[0].length; col++){
      let top = grid[0][col];
      let middle = grid[1][col];
      let bottom = grid[2][col];

      if ((top === middle && top === bottom) && (top === 'X' || top === 'O')){
        winner = top;
      }
    }

    // check diagonals
    if (grid[1][1] !== ' '){
      // diagonal values
      let middle = grid[1][1];
      let topLeft = grid[0][0];
      let topRight = grid[0][2];
      let bottomLeft = grid[2][0];
      let bottomRight = grid[2][2];

      if (middle === topLeft && middle === bottomRight){
        winner = middle;
      } else if (middle === topRight && middle === bottomLeft){
        winner = middle;
      }
    }

    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended

    if (winner){
      this.endGame(winner);
    } else if (!boardNotFull){
      this.endGame('T');
    } else {
      return;
    }

  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = TTT;
