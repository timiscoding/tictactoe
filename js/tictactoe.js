console.log('tictactoe');
var board = function(size){
  var b = {
    grid: [],
    size: function(){
      return this.grid.length;
    },
    show: function(){
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
    setSquare: function(move, piece){
      this.grid[move.y][move.x] = piece;
    },
    getSquare: function(move){
      var square = -1;
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
};

var player = function(name, piece){
  return {
    name: name,
    piece: piece,
    getMove: function(){
      var move = prompt(this.name + ': make a move');
      move = move.split(',');
      return {y: move[0].trim(), x: move[1].trim()};
    }
  };
};

var game = function(){
  var g = {
    board: board(3),
    players: [],
    curPlayer: null,
    nInARow: 3,
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
    play: function(){
      //
      // keep getting player move while invalid
      // update board
      // if game state is w/l/d, show score
      // else
      // change player and loop
      while (true){
        do{
          var move = this.curPlayer.getMove();
        }while (!this.isValidMove(move));
        this.board.setSquare(move, this.curPlayer.piece);
        this.moveCount++;
        this.board.show();
        if (this.isGameOver(move)){
          break;
        }
        this.curPlayer = this.getNextPlayer();
        console.log(move);
      }
    },
    isValidMove: function(move){
      console.log('r:' + move.y + ']c:' + move.x + ']');
      if (move.y >= this.board.size() ||
          move.x >= this.board.size() ||
          this.board.getSquare(move)){
        console.log('invalid move: move outside board OR square already has piece');
        return false;
      }else{
        return true;
      }
    },
    isGameOver: function(move){
      var res = false;
      if (this.checkColumn(move) === this.nInARow ||
          this.checkRow(move) === this.nInARow ||
          this.checkLeftDiag(move) === this.nInARow ||
          this.checkRightDiag(move) === this.nInARow){
        console.log("winner");
        res = true;
      }else if (this.moveCount === this.board.size() * this.board.size()){
        console.log("draw");
        res = true;
      }
      return res;
    },
    checkColumn: function(move){
      return this.getMatches(move, "N") + this.getMatches(move, "S") - 1; // move is counted twice
    },
    checkRow: function(move){
      return this.getMatches(move, "E") + this.getMatches(move, "W") - 1; // move is counted twice
    },
    checkRightDiag: function(move){
      return this.getMatches(move, "NE") + this.getMatches(move, "SW") - 1; // move is counted twice
    },
    checkLeftDiag: function(move){
      return this.getMatches(move, "NW") + this.getMatches(move, "SE") - 1; // move is counted twice
    },
    getMatches: function(move, dir){
      // debugger;
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
    }
  };
  return g;
};

// var b = board(3);
// console.log('empty board');
// b.show();
// b.setSquare({y:0, x:0},'x');
// b.setSquare({y:0, x:1},'x');
// b.setSquare({y:0, x:2},'x');
// b.setSquare({y:2, x:0},'x');
// b.setSquare({y:2, x:1},'o');
// b.setSquare({y:2, x:2},'x');

// console.log('full board');
// b.show();
// console.log(b.getSquare({y:2, x:1}));

// var p1 = player('p1', 'x');
// var p2 = player('p2', 'o');
// console.log(p1.name, p1.piece);
// console.log(p2.name, p2.piece);

var g = game();
g.addPlayer(player('p1', 'x'));
g.addPlayer(player('p2', 'o'));
// console.log(g.board.size(), g.players);
// console.log(g.board.show());
g.play();
// g.board.setSquare({y:0, x:0}, 'x');
// g.board.setSquare({y:1, x:1}, 'x');
// g.board.setSquare({y:2, x:2}, 'x');
// g.board.show();
// console.log(g.checkLeftDiag({y:0, x:0}));