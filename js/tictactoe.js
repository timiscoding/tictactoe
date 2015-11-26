console.log('tictactoe');
var tictactoe = {
  board: function(size){  // creates a board of size x size dimension
    var b = {
      grid: [], // 2d array representing squares on board
      size: function(){ // returns the size of the board
        return this.grid.length;
      },
      show: function(){  // prints the board to console.log
        console.log('cur board');
        var grid = "";
        for (var i=0; i < this.size(); i++){
          for (var j=0; j < this.size(); j++){
            if (this.grid[i][j]){
              grid += this.grid[i][j];
            }else{
              grid += " ";
            }
          }
          grid += "\n";
        }
        console.log(grid);
        console.log('end board');
        return grid;
      },
      setSquare: function(move, piece){ // put an 'x' or 'o' on the board
        this.grid[move.y][move.x] = piece;
      },
      getSquare: function(move){ // get the piece of a square on the board
        var square = -1;    // out of bounds
        if ((move.y >= 0 && move.y < this.size()) &&
            move.x >= 0 && move.x < this.size()){
          square = this.grid[move.y][move.x];
        }
        return square;
      }
    };
    // create an N x N board with empty squares
    for (var i=0; i < size; i++){
      b.grid.push([]);
      for (var j=0; j < size; j++){
        b.grid[i].push(null);
      }
    }
    return b;
  },

  player: function(name, piece){ // create a player with 'name' and 'piece'. Piece can be any string but normally is 'x' or 'o'
    return {
      name: name,
      piece: piece,
      score: 0,
      getMove: function(){   // get player input from prompt
        var move = prompt(this.name + ': make a move');
        move = move.split(',');
        return {y: move[0].trim(), x: move[1].trim()};
      }
    };
  },

  game: function(boardSize, nInARow){ // create a game of boardSize x boardSize dimension and the winner who gets 'nInARow' pieces in a line
    return {
      PLAY: -1,
      DRAW: 0,
      WINNER: 1,
      board: tictactoe.board(boardSize),
      players: [],
      curPlayer: null,
      nInARow: nInARow,
      moveCount: 0,
      addPlayer: function(player){
        this.players.push(player);
        if (this.players.length === 1){
          this.curPlayer = this.players[0];
        }
      },
      getNextPlayer: function(){
        return this.players[(this.players.indexOf(this.curPlayer) + 1) % this.players.length];
      },
      play: function(){ // game playing loop that gets players move, validates it, puts piece on board and checks if game state (continue play, game over)
        while (true){
          var move = this.curPlayer.getMove();
          if (this.makeMove(move)){
            this.board.show();
            var gameState = this.gameState(move);
            if (gameState === this.PLAY){
              this.curPlayer = this.getNextPlayer();
            }else{
              if (gameState === this.WINNER){
                console.log(this.curPlayer.name + " has won");
              }else{
                console.log("DRAW");
              }
              break;
            }
          }
        }
      },
      makeMove: function(move){ // puts a piece on the board and updates total moves made
        if (!this.isValidMove(move)){
          return false;
        }
        this.board.setSquare(move, this.curPlayer.piece);
        this.moveCount++;
        return true;
      },
      isValidMove: function(move){  // checks if move is legal. ie. if 'move' is on a square that is occupied or outside the board dimensions
        if (move.y >= this.board.size() ||
            move.x >= this.board.size() ||
            this.board.getSquare(move)){
          console.log('invalid move: move outside board OR square already has piece');
          return false;
        }else{
          return true;
        }
      },
      gameState: function(move){  // checks if the game is over based on the rules of tic tac toe
        var res = this.PLAY;
        if (this.checkColumn(move) >= this.nInARow ||
            this.checkRow(move) >= this.nInARow ||
            this.checkLeftDiag(move) >= this.nInARow ||
            this.checkRightDiag(move) >= this.nInARow){
          console.log("winner");
          this.curPlayer.score++;
          res = this.WINNER;
        }else if (this.moveCount === this.board.size() * this.board.size()){
          console.log("draw");
          res = this.DRAW;
        }
        return res;
      },
      checkColumn: function(move){ // finds how many pieces are in a vertical line from 'move'
        return this.getMatches(move, "N") + this.getMatches(move, "S") - 1; // move is counted twice
      },
      checkRow: function(move){ // finds how many pieces are in a horizontal line from 'move'
        return this.getMatches(move, "E") + this.getMatches(move, "W") - 1; // move is counted twice
      },
      checkRightDiag: function(move){ // finds how many pieces are in a diagonal leaning right
        return this.getMatches(move, "NE") + this.getMatches(move, "SW") - 1; // move is counted twice
      },
      checkLeftDiag: function(move){ // finds how many pieces are in a diagonal learning left
        return this.getMatches(move, "NW") + this.getMatches(move, "SE") - 1; // move is counted twice
      },
      getMatches: function(move, dir){ // finds how many pieces are in a line starting from move to 'dir' direction
        var square = this.board.getSquare(move);
        if (square !== this.curPlayer.piece){
          return 0;
        }
        switch (dir){
          case "N":
            return 1 + this.getMatches({y: +move.y - 1, x: +move.x}, "N");
            break;
          case "S":
            return 1 + this.getMatches({y: +move.y + 1, x: +move.x}, "S");
            break;
          case "E":
            return 1 + this.getMatches({y: +move.y, x: +move.x + 1}, "E");
            break;
          case "W":
            return 1 + this.getMatches({y: +move.y, x: +move.x - 1}, "W");
            break;
          case "NE":
            return 1 + this.getMatches({y: +move.y - 1, x: +move.x + 1}, "NE");
            break;
          case "SE":
            return 1 + this.getMatches({y: +move.y + 1, x: +move.x + 1}, "SE");
            break;
          case "NW":
            return 1 + this.getMatches({y: +move.y - 1, x: +move.x - 1}, "NW");
            break;
          case "SW":
            return 1 + this.getMatches({y: +move.y + 1, x: +move.x - 1}, "SW");
            break;
        }
      },
      resetBoard: function(boardSize, nInARow){ // resets the game
        this.board = tictactoe.board(boardSize);
        this.nInARow = nInARow;
        this.curPlayer = this.players[0];
        this.moveCount = 0;
      }
    };
  }
};

// var g = tictactoe.game(3, 3);
// g.addPlayer(tictactoe.player('p1', 'x'));
// g.addPlayer(tictactoe.player('p2', 'o'));
// g.play();
