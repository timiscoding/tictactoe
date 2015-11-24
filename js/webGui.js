console.log("webGui");

var webGui = {
  // actualBoard: null,
  board: function(size){
    // webGui.actualBoard = tictactoe.board(size);
    // var b = tictactoe.board(size); // new board with prototype tictactoe.board
     // create NxN grid
      for (var i=0; i < size; i++){
        $("#container").append('<div class="row" y="' + i + '">');
        for (var j=0; j < size; j++){
          $(".row").eq(i).append('<div class="col" x="' + j + '">');
        }
      }
      // change width and height of squares proportional to window height
      $(".row").css("height", "calc(75vh / " + size + ")");
      $(".col").css({"width": "calc(100% / " + size + ")",
                    "height": "calc(75vh / " + size + ")",
                    "line-height": "calc(75vh / " + size + ")"});
    return {
      setSquare: function(move, piece){
        // webGui.actualBoard.setSquare( move, piece ); // Updates the in memory board's grid
          // tictactoe.board().setSquare(move, piece);
          // b.setSquare.call(this.prototype, move, piece);  // should call super method
          $('.row').eq(move.y).find('.col').eq(move.x).text(piece); // Updates the GUI's board's grid to keep them in sync
      }

    }
    // return b;
  },
  game: function(boardSize, nInARow){
    var g = tictactoe.game(boardSize, nInARow);
    // webGui.actualBoard = g.board; // associates the GUI board with the in-memory board
    g.play = function(){
      $(".col").on("click", function(){
        var move = {
          y: $(this).closest(".row").attr("y"),
          x: $(this).attr("x")
        };
        // console.log(move);
        // debugger;
        if (g.makeMove(move)){
          g.webBoard.setSquare(move, g.curPlayer.piece);
          g.board.show();
          // debugger;
          if (g.isGameOver(move)){
            console.log('game over');
          }else{
            g.curPlayer = g.getNextPlayer();
          }
        }

      });
    };
    g.webBoard = webGui.board(boardSize); // Purely for the DOM, but also creates connections to memory
    return g;
  }
};

$(document).ready(function(){
    // var b = webGui.board(3);
    // b.setSquare({y:0, x:0}, 'T');
    // b.setSquare({y:0, x:1}, 'I');
    // b.setSquare({y:0, x:2}, 'M');
    // b.setSquare({y:1, x:0}, 'W');
    // b.setSquare({y:1, x:1}, 'A');
    // b.setSquare({y:1, x:2}, 'S');
    // b.setSquare({y:2, x:0}, 'H');
    // b.setSquare({y:2, x:1}, 'E');
    // b.setSquare({y:2, x:2}, 'R');
    var g = webGui.game(3, 3);
    // debugger;
    g.addPlayer(tictactoe.player('p1', 'x'));
    g.addPlayer(tictactoe.player('p2', 'o'));
    g.play();
});