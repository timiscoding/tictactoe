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
        this.board.show();

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
    checkState: function(move){
      return checkColumn(move);
      // checkRow(move);
      // checkDiag(move);
    },
    checkColumn: function(move){
      return checkN(move) + checkS(move);
    },
    getMatches: function(move, dir){
      if (this.board.getSquare(move) === this.curPlayer.piece){
        getMatches({y: move.y - 1, x: move.x})
      }
      switch (dir){
        case "N":
          break;

      }
    }
    checkN: function(move){
      var matches = 0;
      for (var row=move.y; row >= 0; row--){
        var square = this.board.getSquare({y: row, x: move.x});
        var target = this.curPlayer.piece;
        if (square === target){
          matches++;
        }else{
          break;
        }
      }
      return matches;
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