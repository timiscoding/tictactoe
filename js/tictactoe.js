console.log("tictactoe");
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

  player: function(name, piece, enableAI){ // create a player with 'name' and 'piece'. Piece can be any string but normally is 'x' or 'o'
    return {
      name: name,
      piece: piece,
      score: 0,
      ai: enableAI,
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
      state: this.PLAY,
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
        if (player.ai){
          player.getMove = function(){
            console.log('Player X turn', this);
            var initGameState = new GameState(this, this.curPlayer.piece, this.board.grid);
            initGameState.generateMoves(initGameState);
            console.log('running generateScores');
            var oldBoard = JSON.parse(JSON.stringify(this.board.grid));
            var oldPlayer = this.curPlayer.piece;
            // debugger
            initGameState.generateScores(initGameState);
            this.board.grid = oldBoard;
            this.curPlayer.piece = oldPlayer;
            var nextMove = initGameState.moves[0];
            // debugger
            initGameState.moves.forEach(function(gameState){
              if (gameState.score > nextMove.score) {
                nextMove = gameState;
              }
            });
            console.log(initGameState, nextMove);
            return { x: nextMove.x, y: nextMove.y };
          }.bind(this);
        }
      },
      getNextPlayer: function(){
        return this.players[(this.players.indexOf(this.curPlayer) + 1) % this.players.length];
      },
      play: function() { // game playing loop that gets players move, validates it, puts piece on board and checks if game state (continue play, game over)
        var move;
        while (true){
          move = this.curPlayer.getMove();
          if (this.makeMove(move)){
            this.board.show();
            this.finalState(move);

            if (this.state === this.PLAY){
              this.curPlayer = this.getNextPlayer();
            }else{
              if (this.state === this.WINNER){
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
      finalState: function(move){  // checks if the game is over based on the rules of tic tac toe
        // var res = this.PLAY;
        if (this.checkColumn(move) >= this.nInARow ||
            this.checkRow(move) >= this.nInARow ||
            this.checkLeftDiag(move) >= this.nInARow ||
            this.checkRightDiag(move) >= this.nInARow){
          // console.log("winner");
          this.curPlayer.score++;
          this.state = this.WINNER;
        }else if ( _.chain( this.board.grid ).flatten().compact().value().length === this.board.size() * this.board.size()){
          // console.log("draw");
          this.state = this.DRAW;
        }else{
          this.state = this.PLAY;
        }
        // return res;
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
          case "S":
            return 1 + this.getMatches({y: +move.y + 1, x: +move.x}, "S");
          case "E":
            return 1 + this.getMatches({y: +move.y, x: +move.x + 1}, "E");
          case "W":
            return 1 + this.getMatches({y: +move.y, x: +move.x - 1}, "W");
          case "NE":
            return 1 + this.getMatches({y: +move.y - 1, x: +move.x + 1}, "NE");
          case "SE":
            return 1 + this.getMatches({y: +move.y + 1, x: +move.x + 1}, "SE");
          case "NW":
            return 1 + this.getMatches({y: +move.y - 1, x: +move.x - 1}, "NW");
          case "SW":
            return 1 + this.getMatches({y: +move.y + 1, x: +move.x - 1}, "SW");
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

function GameState(game, player, board){
  this.game = game;
  this.moves = [];
  this.player = player; // player to move
  this.board = board; //
};
var counter = 0;
// make a move for every empty square and invoke it again for the newly generated gamestate
GameState.prototype.generateMoves = function(gameState){
  // make a gamestate consisting of the current player, the pieces on the board with the new move and a list of child gamestates
  // debugger;
  for (var y=0; y < gameState.board.length; y++){
    for (var x=0; x < gameState.board[y].length; x++){
      if (!!gameState.board[y][x]) { continue; } // square has been played
      var nextBoard = JSON.parse(JSON.stringify(gameState.board)); // deep copy board
      nextBoard[y][x] = gameState.player;
      var nextPlayer;
      if (gameState.player === 'x'){
        nextPlayer = 'o';
      } else {
        nextPlayer = 'x';
      }
      var gameStateChild = new GameState(this.game, nextPlayer, nextBoard);
      gameStateChild.x = x;
      gameStateChild.y = y;
      gameState.moves.push(gameStateChild);
      counter++;
      gameState.generateMoves(gameStateChild);
    }
  }
}

GameState.prototype.generateScores = function(gameState){
  // debugger
  if (gameState.board[0][0] === 'x' &&
      gameState.board[0][1] === 'o' &&
      gameState.board[0][2] === null &&
      gameState.board[1][0] === 'x' &&
      gameState.board[1][1] === 'x' &&
      gameState.board[1][2] === null &&
      gameState.board[2][0] === 'o' &&
      gameState.board[2][1] === null &&
      gameState.board[2][2] === 'o'
    ){
      // console.log('gameState', gameState);
      // debugger
    }
  // if (!gameState.moves.length){
    // return gameState.getScore(gameState);
  // }

  var finalScore = gameState.getScore(gameState);
  if (Number.isInteger(finalScore)){ // leaf game state
    gameState.score = finalScore;
    return finalScore;
  }
  var scores = [];
  gameState.moves.forEach(function(gameState){
    var res = gameState.generateScores(gameState);
    if (Number.isInteger(res)){
      scores.push(res);
    }
  });

  if (scores.length){
    if (gameState.player === 'x') {
      gameState.score = Math.max.apply(null, scores);
    } else {
      gameState.score = Math.min.apply(null, scores);
    }
    return gameState.score;
  }

};

GameState.prototype.getScore = function(gameState){
  // var moves = [{ x: 0, y: 0}, { x: 1, y: 1 }, { x: 2, y: 2}];
  var lastMove = { x: gameState.x, y: gameState.y };
  var lastPlayer = gameState.player === 'x' ? 'o' : 'x';

  this.game.board.grid = gameState.board;
  this.game.curPlayer.piece = lastPlayer;
  // for (var i=0; i < moves.length; i++){
    this.game.finalState(lastMove);

    if (this.game.state === this.game.WINNER && lastPlayer === 'x') {
      return 1;
    }else if (this.game.state === this.game.WINNER && lastPlayer === 'o') {
      return -1;
    }else if (this.game.state === this.game.DRAW){
      return 0;
    }else { // no winner/draw yet
      return null;
    }
  // }

}

// var g = tictactoe.game(3, 3);
// g.addPlayer(tictactoe.player('p1', 'x', true));
// g.addPlayer(tictactoe.player('p2', 'o'));
//
//
// g.play();
