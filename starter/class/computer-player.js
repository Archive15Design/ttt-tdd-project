
class ComputerPlayer {

  static getValidMoves(grid) {

    let validMoves = [];

    for (let row = 0; row < grid.length; row++){
      let currentRow = grid[row];
      for (let col = 0; col < currentRow.length; col++){
        let currentCol = currentRow[col];
        if (currentCol === ' '){
          const move = {row: row, col: col};
          validMoves.push(move);
        }
      }
    }

    return validMoves;
  }

  static randomMove(grid) {

    const validMoves = ComputerPlayer.getValidMoves(grid);

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    const randomMove = validMoves[getRandomInt(0, validMoves.length)];
    return randomMove;
  }

  static getWinningMoves(grid, symbol) {
    // a winning move wins the game
    let win = [];

    const validMoves = ComputerPlayer.getValidMoves(grid);

    // check horizontal winning moves
    for (let i = 0; i < 4; i++){
        let possibleWin = [];
        let movesOnRow = validMoves.filter(move => move.row === i);

        if (movesOnRow.length === 1){
          possibleWin = grid[i].filter(cell => cell !== symbol);
        }

        if (possibleWin.length === 1 && possibleWin[0] === ' '){
          win.push(movesOnRow[0]);
        }
      }

    // check vertical wins
      for (let j = 0; j < grid[0].length; j++){
        let possibleWin = [];

        // make column
        let column = [];
        for (let i = 0; i < grid.length; i++){
          column.push(grid[i][j]);
        }

        let movesInColumn = validMoves.filter(move => move.col === j);
        if (movesInColumn.length === 1){
          possibleWin = column.filter(cell => cell !== symbol);
        }

        if (possibleWin.length === 1 && possibleWin[0] === ' '){
          win.push(movesInColumn[0]);
        }
      }

    // check diagonal wins

    // make an array with the diagonal cells and check if any valid moves are included there
    // create diagonal columns starting from the left-most cell
    let diagColumnTop = [
            {index: grid[0][0], row: 0, col: 0},
            {index: grid[1][1], row: 1, col: 1},
            {index: grid[2][2], row: 2, col: 2},
          ];
    let diagColumnBottom = [
            {index: grid[2][0], row: 2, col: 0},
            {index: grid[1][1], row: 1, col: 1},
            {index: grid[0][2], row: 0, col: 2},
          ];

    let diagonalColumns = [diagColumnTop, diagColumnBottom];

    // check for possible wins using filter
    for (const column of diagonalColumns){
      let possibleWin = column.filter(cell => cell.index !== symbol);

      if (possibleWin.length === 1 && possibleWin[0].index === ' '){
        let move = possibleWin[0];
        let winningMove = {row: move.row, col: move.col};
        win.push(winningMove);
      }
    }

    // use filter to remove any of own symbol
    // check if length one and only element is an empty space
    // return that empty space

      return win;
  }

  static getSmartMove(grid, symbol) {

    // determine opponent symbol
    let opponentSymbol;
    if (symbol === 'X'){
      opponentSymbol = 'O'
    } else {
      opponentSymbol = 'X'
    }

    // check for win
    let winningMoves = ComputerPlayer.getWinningMoves(grid, symbol);
    if (winningMoves.length > 0){
      return winningMoves[0];
    }

    // check for blocks
    let blockingMoves = ComputerPlayer.getWinningMoves(grid, opponentSymbol);
    if(blockingMoves.length > 0){
      return blockingMoves[0];
    }

  }

  static checkBoard(row, col, grid) {
    const cellContent = grid[row][col];
    return cellContent;
  }
}


module.exports = ComputerPlayer;
