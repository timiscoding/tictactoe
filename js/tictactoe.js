console.log("tictactoe");
(function(exports) {
  var PLAY = -1;
  var DRAW = 0;
  var WINNER = 1;

  var finalState = function(move, board){ // returns the state of the game given a valid move with a valid piece on the square
    var checkColumn = function(move){ // finds how many pieces are in a vertical line from 'move'
      return getMatches(move, "N") + getMatches(move, "S") - 1; // move is counted twice
    };
    var checkRow = function(move){ // finds how many pieces are in a horizontal line from 'move'
      return getMatches(move, "E") + getMatches(move, "W") - 1; // move is counted twice
    };
    var checkRightDiag = function(move){ // finds how many pieces are in a diagonal leaning right
      return getMatches(move, "NE") + getMatches(move, "SW") - 1; // move is counted twice
    };
    var checkLeftDiag = function(move){ // finds how many pieces are in a diagonal learning left
      return getMatches(move, "NW") + getMatches(move, "SE") - 1; // move is counted twice
    };
    var getMatches = function(move, dir){ // finds how many pieces are in a line starting from move to 'dir' direction
      var square = board.getSquare(move);
      if (square !== move.piece){
        return 0;
      }
      switch (dir){
        case "N":
          return 1 + getMatches({y: +move.y - 1, x: +move.x, piece: move.piece}, "N");
        case "S":
          return 1 + getMatches({y: +move.y + 1, x: +move.x, piece: move.piece}, "S");
        case "E":
          return 1 + getMatches({y: +move.y, x: +move.x + 1, piece: move.piece}, "E");
        case "W":
          return 1 + getMatches({y: +move.y, x: +move.x - 1, piece: move.piece}, "W");
        case "NE":
          return 1 + getMatches({y: +move.y - 1, x: +move.x + 1, piece: move.piece}, "NE");
        case "SE":
          return 1 + getMatches({y: +move.y + 1, x: +move.x + 1, piece: move.piece}, "SE");
        case "NW":
          return 1 + getMatches({y: +move.y - 1, x: +move.x - 1, piece: move.piece}, "NW");
        case "SW":
          return 1 + getMatches({y: +move.y + 1, x: +move.x - 1, piece: move.piece}, "SW");
      }
    };

    var res = PLAY;
    if (checkColumn(move) >= board.nInARow ||
        checkRow(move) >= board.nInARow ||
        checkLeftDiag(move) >= board.nInARow ||
        checkRightDiag(move) >= board.nInARow){
      res = WINNER;
    }else if ( _.chain( board.grid ).flatten().compact().value().length === board.size() * board.size()){
      res = DRAW;
    }else{
      res = PLAY;
    }
    return res;
  }


  var GameState = function(player, board){
    this.moves = [];
    this.player = player; // player to move
    this.board = board;
  };

  // make a move for every empty square and invoke it again for the newly generated gamestate
  GameState.prototype = {
    generateMoves: function(gameState){
      // make a gamestate consisting of the current player, the pieces on the board with the new move and a list of child gamestates
      // debugger;
      for (var y=0; y < gameState.board.grid.length; y++){
        for (var x=0; x < gameState.board.grid[y].length; x++){
          if (!!gameState.board.grid[y][x]) { continue; } // square has been played
          var nextBoard = new Board(gameState.board.size(), gameState.board.nInARow);
          nextBoard.grid = JSON.parse(JSON.stringify(gameState.board.grid)); // deep copy whatever was originally in grid
          nextBoard.grid[y][x] = gameState.player;
          var nextPlayer;
          if (gameState.player === 'x'){
            nextPlayer = 'o';
          } else {
            nextPlayer = 'x';
          }
          var gameStateChild = new GameState(nextPlayer, nextBoard);
          gameStateChild.x = x;
          gameStateChild.y = y;
          gameState.moves.push(gameStateChild);
          gameState.generateMoves(gameStateChild);
        }
      }
    },
    generateScores: function(gameState){
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
    },
    getScore: function(gameState){
      var lastPlayer = gameState.player === 'x' ? 'o' : 'x';
      var lastMove = { x: gameState.x, y: gameState.y, piece: lastPlayer };

      var state = finalState(lastMove, gameState.board);

      if (state === WINNER && lastPlayer === 'x') {
        return 1;
      }else if (state === WINNER && lastPlayer === 'o') {
        return -1;
      }else if (state === DRAW){
        return 0;
      }else { // no winner/draw yet
        return null;
      }
    }
  }

  var Board = function(size, nInARow){ // creates a board of size x size dimension
    this.grid = [];
    this.nInARow = nInARow;
    for (var i=0; i < size; i++){
      this.grid.push([]);
      for (var j=0; j < size; j++){
        this.grid[i].push(null);
      }
    }
  }

  Board.prototype = {
    size: function(){
      return this.grid.length;
    },
    show: function(){  // prints the board to console
      var grid = "";
      var squareLen = 3;
      var verticalDividerLen = this.size() - 1;
      var horizontalDividerLen = squareLen * this.size() + verticalDividerLen;
      for (var i=0; i < this.size(); i++){
        for (var j=0; j < this.size(); j++){
          if (this.grid[i][j]){
            grid += ' ' + this.grid[i][j] + ' ';
          }else{
            var pos = i * this.size() + j;
            grid += ' ' + pos + ' ';
          }
          if (j < this.size() - 1){ // add divider except to last square in a row
            grid += "|";
          }
        }
        if (i < this.size() - 1){
          grid += '\n' + new Array(horizontalDividerLen).join('-') + '\n';
        } else {
          grid += '\n\n';
        }
      }
      console.log(grid);
    },
    setSquare: function(move, piece){ // put a piece on a square
      this.grid[move.y][move.x] = piece;
    },
    getSquare: function(move){ // get the piece given a location on the board
      var square = -1;    // invalid piece on square
      if ((move.y >= 0 && move.y < this.size()) &&
          move.x >= 0 && move.x < this.size()){
        square = this.grid[move.y][move.x];
      }
      return square;
    },
    equal: function(board){
      if (this.grid.length !== board.grid.length || this.grid[0].length !== board.grid[0].length){
        return false;
      }
      for (var y=0; y < this.grid.length; y++){
        for (var x=0; x < this.grid[0].length; x++){
          if (this.grid[y][x] !== board.grid[y][x]){
            return false;
          }
        }
      }
      return true;
    }
  };

  var Player = function(name, piece, enableAI){ // create a player with 'name' and 'piece'. Piece can be any string but normally is 'x' or 'o'
    this.name = name;
    this.piece = piece;
    this.score = 0;
    this.ai = enableAI;
  }

  Player.prototype = {
    getMove: function(){   // get player input from prompt
      return prompt(this.name + ': make a move');
    }
  }

  var Game = function(boardSize, nInARow){ // create a game of boardSize x boardSize dimension and the winner who gets 'nInARow' pieces in a line
      this.board = new Board(boardSize, nInARow);
      this.players = [];
      this.moveCount = 0;
  };

  Game.prototype = {
    play: function() { // game playing loop that gets players move, validates it, puts piece on board and checks if game state (continue play, game over)
      while (true){
        if (!this.curPlayer.ai){
          this.board.show();
        }
        var move = this.curPlayer.getMove();
        console.log('move', move);
        if (move === 'q' || move === 'r'){
          return move;
        }
        if (this.makeMove(move)){
          var state = finalState(move, this.board);
          if (state === PLAY){
            this.curPlayer = this.getNextPlayer();
          }else{
            this.board.show();
            if (state === WINNER){
              this.curPlayer.score++;
              console.log(this.curPlayer.name + " has won");
            }else{
              console.log("DRAW");
            }
            var playAgain = prompt('Play again? (q)uit (r)estart');
            return playAgain;
          }
        }
      }
    },
    addPlayer: function(player){
      this.players.push(player);
      if (this.players.length === 1){
        this.curPlayer = this.players[0];
      }
      if (player.ai){
        this.gameTree = new GameState('x', new Board(this.board.size(), this.board.nInARow));
        console.log('generating game tree');
        this.gameTree.generateMoves(this.gameTree);
        console.log('generating game scores');
        this.gameTree.generateScores(this.gameTree);
        player.getMove = function(){
          if (this.moveCount === 0){
            this.curGameState = this.gameTree;
          } else {
            for (var i=0; i < this.curGameState.moves.length; i++){
              var gameState = this.curGameState.moves[i];
              if (gameState.board.equal(this.board)){
                this.curGameState = gameState;
                break;
              }
            }
          }
          var nextMove = this.curGameState.moves[0];
          this.curGameState.moves.forEach(function(gameState){
            if (gameState.score > nextMove.score) {
              nextMove = gameState;
            }
          });
          this.curGameState = nextMove;
          return { x: nextMove.x, y: nextMove.y, piece: this.curPlayer.piece };
        }.bind(this);
      }
    },
    getNextPlayer: function(){
      return this.players[(this.players.indexOf(this.curPlayer) + 1) % this.players.length];
    },
    makeMove: function(move){ // puts a piece on the board and updates total moves made
      if (typeof move === 'string'){ // user input square position
        move = {x: move % this.board.size(), y: ~~(move / this.board.size()), piece: this.curPlayer.piece} // convert square position to coords
      }
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
    resetBoard: function(boardSize, nInARow){ // resets the game
      this.board = new Board(boardSize, nInARow);
      this.nInARow = nInARow;
      this.curPlayer = this.players[0];
      this.moveCount = 0;
    }
  };

  exports.Game = Game;
  exports.Player = Player;
})(this.tictactoe = {});

// play a game in console
(function main() {
  var game = new tictactoe.Game(3,3);
  game.addPlayer(new tictactoe.Player('p1', 'x'));
  game.addPlayer(new tictactoe.Player('p2', 'o', true));
  do {
    var playAgainInput = game.play();
    game.resetBoard(3,3);
  } while (playAgainInput !== 'q')
})();
