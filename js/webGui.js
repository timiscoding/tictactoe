console.log("webGui");
var webGui = {
  board: function(size){
    var b = {
      setSquare: function(move, piece){
        $('.row').eq(move.y).find('.col').eq(move.x).text(piece);
      }
    };
    // create NxN grid
    for (var i=0; i < size; i++){
      $("#container").append('<div class="row" row="' + i + '">');
      for (var j=0; j < size; j++){
        $(".row").eq(i).append('<div class="col">');
      }
    }
    // change width and height of squares proportional to window height
    $(".row").css("height", "calc(75vh / " + size + ")");
    $(".col").css({"width": "calc(100% / " + size + ")",
                  "height": "calc(75vh / " + size + ")",
                  "line-height": "calc(75vh / " + size + ")"});
    return b;
  },
  game: function(boardSize, nInARow){
    var g = tictactoe.gam(boardSize, nInARow);
    g.play = function(){
      $(".col").on("click", function(){
          // $(this)
          if (!this.isValidMove(move)){
            return;
          }
          this.board.setSquare(move, this.curPlayer.piece);
          this.moveCount++;
          this.board.show();
          if (this.isGameOver(move)){
            break;
          }
          this.curPlayer = this.getNextPlayer();
      });
    };
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
    var g = webGui.game();
    g.addPlayer(tictactoe.player('p1', 'x'));
    g.addPlayer(tictactoe.player('p2', 'o'));
});